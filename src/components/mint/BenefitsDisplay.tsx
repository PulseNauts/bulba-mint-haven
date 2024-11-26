import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, Fish } from "lucide-react";
import { HolderTier } from '@/hooks/useHolderEligibility';
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

  if (tier === 'whale') {
    return (
      <Alert className="bg-purple-500/10 border-purple-500/20">
        <Crown className="h-5 w-5 text-purple-500" />
        <AlertDescription>
          <strong>Whale Benefits Active:</strong>
          <p>Free Packs: {freePacks}</p>
          <p>Discounted Packs: {discountedPacks}</p>
        </AlertDescription>
      </Alert>
    );
  }

  if (tier === 'holder') {
    return (
      <Alert className="bg-cyan-500/10 border-cyan-500/20">
        <Fish className="h-5 w-5 text-cyan-500" />
        <AlertDescription>
          <strong>Holder Benefits Active:</strong>
          <p>Discounted Packs: {discountedPacks}</p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
});

BenefitsDisplay.displayName = 'BenefitsDisplay';