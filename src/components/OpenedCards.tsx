import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { pulsechain } from "viem/chains";
import { CONTRACT_CONFIG } from "@/config/contract";
import { CONTRACT_ABI } from "@/config/abi";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { CardStats } from "./CardStats";

interface OpenedCard {
  id: number;
  image?: string;
  name?: string;
}

export const OpenedCards = () => {
  const { address, isConnected } = useAccount();
  const [cards, setCards] = useState<OpenedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFoundCardId, setLastFoundCardId] = useState(223);
  const [scanTrigger, setScanTrigger] = useState(0);

  const client = createPublicClient({
    chain: pulsechain,
    transport: http()
  });

  const checkCardOwnership = async (tokenId: number) => {
    try {
      const balance = await client.readContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`, BigInt(tokenId)],
      });

      return balance > 0n;
    } catch (error) {
      console.error(`Error checking ownership for token ${tokenId}:`, error);
      return false;
    }
  };

  const fetchCardMetadata = async (tokenId: number) => {
    try {
      const uri = await client.readContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'uri',
        args: [BigInt(tokenId)],
      });

      if (uri) {
        const response = await fetch(uri.toString());
        const metadata = await response.json();
        return {
          id: tokenId,
          image: metadata.image,
          name: metadata.name
        };
      }
    } catch (error) {
      console.error(`Error fetching metadata for token ${tokenId}:`, error);
    }
    return null;
  };

  const triggerRescan = () => {
    console.log("Starting rescan...");
    setCards([]); // Reset cards array
    setLastFoundCardId(223); // Reset last found card ID
    setScanTrigger(prev => prev + 1);
  };

  if (typeof window !== 'undefined') {
    (window as any).triggerCardRescan = triggerRescan;
  }

  useEffect(() => {
    const scanCards = async () => {
      if (!address || !isConnected) return;
      
      setIsLoading(true);
      console.log(`Starting to check cards from ${lastFoundCardId} to 888...`);
      
      for (let tokenId = lastFoundCardId; tokenId <= 888; tokenId++) {
        const ownsCard = await checkCardOwnership(tokenId);
        if (ownsCard) {
          const cardMetadata = await fetchCardMetadata(tokenId);
          if (cardMetadata) {
            setCards(prevCards => [...prevCards, cardMetadata]);
            setLastFoundCardId(tokenId + 1);
          }
        }
      }

      setIsLoading(false);
      console.log(`Finished checking cards. Found ${cards.length} cards total.`);
    };

    scanCards();
  }, [address, isConnected, scanTrigger]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-8">
      <CardStats totalCards={cards.length} loadingCards={isLoading} />
      
      <div className="relative">
        <h2 className="text-2xl font-semibold mb-6 text-custom-darkGreen flex items-center gap-2">
          My Collection {isLoading && "(Scanning for cards...)"}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group relative aspect-square overflow-hidden bg-gradient-to-br from-custom-lightGreen to-custom-mediumGreen hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.name || `Card #${card.id}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-custom-darkGreen">Loading...</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-semibold truncate">
                    {card.name || `Card #${card.id}`}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {isLoading && cards.length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-darkGreen mx-auto mb-4" />
            <p className="text-custom-darkGreen">Scanning your wallet for cards...</p>
          </div>
        )}

        {!isLoading && cards.length === 0 && (
          <div className="text-center py-12 bg-custom-lightGreen/50 rounded-lg">
            <h3 className="text-xl font-semibold text-custom-darkGreen mb-2">No Cards Found</h3>
            <p className="text-custom-darkGreen/80">
              You haven't opened any packs yet or your cards are still being processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};