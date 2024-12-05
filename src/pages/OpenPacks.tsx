import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { useAccount } from "wagmi";
import { PackAmountTracker } from "@/components/PackAmountTracker";
import { OpenedCards } from "@/components/OpenedCards";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/ui/PageContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { CollectionStats } from "@/components/CollectionStats";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const OpenPacks = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <PageContainer className="flex items-center justify-center">
        <GlassCard className="p-6 text-center max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4 text-custom-light">Connect Wallet</h2>
            <p className="text-custom-light/80 mb-4">Please connect your wallet to view your profile</p>
            <ConnectButton />
          </motion.div>
        </GlassCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9DE182] to-[#65B741] bg-clip-text text-transparent">
          Bulbasaur Profile
        </h1>
        <ConnectButton showBalance={false} />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mt-8"
      >
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#65B741]" />
          <h2 className="text-2xl font-semibold text-custom-light">Your Unopened Packs</h2>
        </div>
        <GlassCard className="p-6 border-[#9DE182]/20">
          <PackAmountTracker />
        </GlassCard>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <OpenedCards />
      </motion.section>
    </PageContainer>
  );
};

export default OpenPacks;