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
            className="space-y-4 flex flex-col items-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground animate-cyber-glow">Initialize Neural Link</h2>
            <p className="text-muted-foreground mb-4 font-mono">Connect your digital wallet to access the cyber vault</p>
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
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent animate-neon-flicker">
          CYBER VAULT
        </h1>
        <ConnectButton showBalance={false} />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mt-8"
      >
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-neon-cyan animate-neon-pulse" />
          <h2 className="text-2xl font-semibold text-foreground font-mono tracking-wide">DATA CONTAINERS</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan via-transparent to-neon-pink"></div>
        </div>
        <GlassCard className="p-6 animate-cyber-float">
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