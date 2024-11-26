import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, Fish } from "lucide-react";
import { HolderTier } from '@/hooks/useHolderEligibility';
import { motion } from "framer-motion";
import { memo } from 'react';

interface BenefitsDisplayProps {
  tier: HolderTier;
  freePacks: number;
  discountedPacks: number;
}

export const BenefitsDisplay = memo(({ tier, freePacks, discountedPacks }: BenefitsDisplayProps) => {
  if (!tier) {
    return null;
  }

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  if (tier === 'whale') {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={containerVariants}
        transition={{ duration: 0.3 }}
      >
        <Alert className="glass-card bg-purple-500/10 border-purple-500/20 backdrop-blur-lg hover:bg-purple-500/20 transition-all duration-300">
          <div className="flex items-start gap-4">
            <Crown className="h-6 w-6 text-purple-500 animate-glow" />
            <AlertDescription className="space-y-2">
              <h3 className="text-lg font-semibold text-purple-200 mb-1">
                Whale Benefits Active
              </h3>
              <div className="space-y-1 text-purple-100/80">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Free Packs:</span>
                  <span className="text-purple-200">{freePacks}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Discounted Packs:</span>
                  <span className="text-purple-200">{discountedPacks}</span>
                </p>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      </motion.div>
    );
  }

  if (tier === 'holder') {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={containerVariants}
        transition={{ duration: 0.3 }}
      >
        <Alert className="glass-card bg-blue-500/10 border-blue-500/20 backdrop-blur-lg hover:bg-blue-500/20 transition-all duration-300">
          <div className="flex items-start gap-4">
            <Fish className="h-6 w-6 text-blue-400 animate-float" />
            <AlertDescription className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-200 mb-1">
                Holder Benefits Active
              </h3>
              <div className="space-y-1 text-blue-100/80">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Discounted Packs:</span>
                  <span className="text-blue-200">{discountedPacks}</span>
                </p>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      </motion.div>
    );
  }

  return null;
});

BenefitsDisplay.displayName = 'BenefitsDisplay';