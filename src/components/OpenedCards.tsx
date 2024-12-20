import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { pulsechain } from "viem/chains";
import { CONTRACT_CONFIG } from "@/config/contract";
import { CONTRACT_ABI } from "@/config/abi";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { CardStats } from "./CardStats";
import { CardModal } from "./CardModal";
import { useInView } from "react-intersection-observer";

interface OpenedCard {
  id: number;
  image?: string;
  name?: string;
}

// Helper function to format URIs
const formatUri = (uri: string, tokenId: number) => {
  console.log('Original URI:', uri);
  // Check if URI contains {id} placeholder
  if (uri.includes('{id}')) {
    const formattedId = tokenId.toString(16).padStart(64, '0');
    const formattedUri = uri.replace('{id}', formattedId);
    console.log('Formatted URI:', formattedUri);
    return formattedUri;
  }
  return uri;
};

// Helper function to format IPFS URLs
const formatImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) {
    console.log('No image URL provided');
    return undefined;
  }
  
  console.log('Original image URL:', imageUrl);
  
  // If it's already an HTTP URL, return as is
  if (imageUrl.startsWith('http')) {
    console.log('HTTP URL detected, returning as is:', imageUrl);
    return imageUrl;
  }
  
  // Handle IPFS URLs
  if (imageUrl.startsWith('ipfs://')) {
    const formattedUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    console.log('IPFS URL formatted:', formattedUrl);
    return formattedUrl;
  }
  
  console.log('Unknown URL format, returning as is:', imageUrl);
  return imageUrl;
};

export const OpenedCards = () => {
  const { address, isConnected } = useAccount();
  const [cards, setCards] = useState<OpenedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFoundCardId, setLastFoundCardId] = useState(223);
  const [scanTrigger, setScanTrigger] = useState(0);
  const [selectedCard, setSelectedCard] = useState<OpenedCard | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  console.log('OpenedCards Component - Wallet Status:', { address, isConnected });

  const client = createPublicClient({
    chain: pulsechain,
    transport: http()
  });

  const checkCardOwnership = async (tokenId: number) => {
    try {
      console.log(`Checking ownership for token ${tokenId}...`);
      const balance = await client.readContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`, BigInt(tokenId)],
      });
      console.log(`Token ${tokenId} balance:`, balance.toString());
      return balance > 0n;
    } catch (error) {
      console.error(`Error checking ownership for token ${tokenId}:`, error);
      return false;
    }
  };

  const fetchCardMetadata = async (tokenId: number) => {
    try {
      console.log(`Fetching metadata for token ${tokenId}...`);
      const uri = await client.readContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'uri',
        args: [BigInt(tokenId)],
      });

      console.log(`Raw URI from contract for token ${tokenId}:`, uri);

      if (uri) {
        const formattedUri = formatUri(uri.toString(), tokenId);
        console.log(`Attempting to fetch metadata from: ${formattedUri}`);
        
        const response = await fetch(formattedUri);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const metadata = await response.json();
        console.log(`Full metadata for token ${tokenId}:`, metadata);
        
        const formattedImage = formatImageUrl(metadata.image);
        console.log(`Formatted image URL for token ${tokenId}:`, formattedImage);
        
        return {
          id: tokenId,
          image: formattedImage,
          name: metadata.name
        };
      }
    } catch (error) {
      console.error(`Error fetching metadata for token ${tokenId}:`, error);
    }
    return { id: tokenId };
  };

  useEffect(() => {
    const scanCards = async () => {
      if (!address || !isConnected) {
        console.log('No wallet connected, skipping card scan');
        return;
      }
      
      setIsLoading(true);
      console.log(`Starting to check cards from ${lastFoundCardId} to 888...`);
      
      // Scan in smaller batches for better mobile performance
      const BATCH_SIZE = 20;
      for (let tokenId = lastFoundCardId; tokenId <= 888; tokenId += BATCH_SIZE) {
        console.log(`Scanning batch starting at token ${tokenId}...`);
        const batch = await Promise.all(
          Array.from({ length: BATCH_SIZE }, (_, i) => {
            const currentId = tokenId + i;
            if (currentId <= 888) {
              return checkCardOwnership(currentId);
            }
            return Promise.resolve(false);
          })
        );

        const ownedInBatch = batch
          .map((owns, i) => owns ? tokenId + i : null)
          .filter((id): id is number => id !== null);

        console.log(`Found ${ownedInBatch.length} owned cards in current batch`);

        if (ownedInBatch.length > 0) {
          const newMetadata = await Promise.all(
            ownedInBatch.map(id => fetchCardMetadata(id))
          );
          
          console.log('New metadata fetched:', newMetadata);
          
          setCards(prev => {
            const updated = [...prev, ...newMetadata.filter(m => m !== null)];
            console.log('Updated cards array:', updated);
            return updated;
          });
        }

        setLastFoundCardId(tokenId + BATCH_SIZE);
      }

      setIsLoading(false);
      console.log(`Finished checking cards. Found ${cards.length} cards total.`);
    };

    if (inView) {
      console.log('Component in view, starting card scan...');
      scanCards();
    }
  }, [address, isConnected, scanTrigger, inView]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-8">
      <CardStats totalCards={cards.length} loadingCards={isLoading} />
      
      <div className="relative" ref={ref}>
        <h2 className="text-2xl font-semibold mb-6 text-custom-darkGreen flex items-center gap-2">
          My Collection {isLoading && "(Scanning for cards...)"}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {cards.map((card) => {
            const isVideo = card.image?.toLowerCase().endsWith('.mp4');
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedCard(card)}
              >
                <Card className="group relative aspect-square overflow-hidden bg-gradient-to-br from-custom-lightGreen to-custom-mediumGreen hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  {card.image ? (
                    isVideo ? (
                      <video
                        src={card.image}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={card.image}
                        alt={card.name || `Card #${card.id}`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    )
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
            );
          })}
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

        <CardModal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          image={selectedCard?.image}
          name={selectedCard?.name}
        />
      </div>
    </div>
  );
};
