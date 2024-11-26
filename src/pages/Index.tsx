import { useAccount, useWriteContract, useDisconnect } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { CONTRACT_CONFIG } from "@/config/contract";
import { CONTRACT_ABI } from "@/config/abi";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from "react-router-dom";
import { useHolderEligibility } from "@/hooks/useHolderEligibility";
import { useMinting } from "@/hooks/useMinting";
import { MintControls } from "@/components/MintControls";
import { motion, AnimatePresence } from "framer-motion";
import { CollectionStats } from "@/components/CollectionStats";
import { PageContainer } from "@/components/ui/PageContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { pulsechain } from 'viem/chains';

const Index = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { tier, freePacks, discountedPacks, maxMintAmount, checkEligibility } = useHolderEligibility();
  const { writeContractAsync } = useWriteContract();
  const { mintAmount, setMintAmount, isMinting } = useMinting(tier, freePacks, discountedPacks);

  const handleMint = async (price: bigint) => {
    if (!address) return;
    
    try {
      console.log('Minting with price:', {
        priceInWei: price.toString(),
        mintAmount: mintAmount.toString()
      });
      
      await writeContractAsync({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintPacks',
        args: [BigInt(mintAmount)],
        value: price,
        chain: pulsechain,
        account: address as `0x${string}`
      });
      
      toast({
        title: "Success!",
        description: `Successfully minted ${mintAmount} pack${mintAmount > 1 ? 's' : ''}!`,
      });
    } catch (error) {
      console.error('Minting error:', {
        error: error instanceof Error ? error.message : String(error)
      });
      toast({
        variant: "destructive",
        title: "Minting Error",
        description: "Failed to mint. Please try again.",
      });
    }
  };

  return (
    <PageContainer>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-custom-primary to-custom-accent bg-clip-text text-transparent">
              Bulbasaur Cards: Unlock Exclusive Collectibles!
            </h1>
            <p className="text-lg text-custom-light/80 max-w-2xl leading-relaxed">
              Dive into the PulseChain community and discover unique cards with exciting rarities. 
              Secure your packs, find hidden gems, and join the next big thing in digital collectibles today!
            </p>
          </div>
          <div className="glass-effect z-10">
            <ConnectButton />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-custom-light">Mint Your Packs</h2>
              <p className="text-lg text-custom-light/80">
                Join the Bulbasaur Cards community on PulseChain. Each pack contains unique cards with varying rarity.
              </p>
            </div>

            <CollectionStats />

            <GlassCard className="p-6 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
              <MintControls
                mintAmount={mintAmount}
                setMintAmount={setMintAmount}
                isConnected={isConnected}
                isMinting={isMinting}
                onMint={handleMint}
                maxMintAmount={maxMintAmount}
              />
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square relative pack-glow animate-float group">
              <motion.img
                src="/lovable-uploads/d088a9e7-5cd7-41fe-b056-00dbec2fd5be.png"
                alt="Pokechain Pack"
                className="w-full h-full object-contain rounded-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 card-hover"
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <div className="absolute inset-0 bg-gradient-radial from-custom-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </PageContainer>
  );
};

export default Index;