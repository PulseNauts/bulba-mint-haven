import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, Fish } from "lucide-react";
import { HolderTier } from '@/hooks/useHolderEligibility';

interface BenefitsDisplayProps {
  tier: HolderTier;
  freePacks: number;
  discountedPacks: number;
}

export const BenefitsDisplay = ({ tier, freePacks, discountedPacks }: BenefitsDisplayProps) => {
  if (!tier) {
    console.log('No tier detected, skipping benefits display');
    return null;
  }

  if (tier === 'whale') {
    console.log('Displaying whale benefits:', { freePacks, discountedPacks });
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
    console.log('Displaying holder benefits:', { discountedPacks });
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

  console.log('No special benefits to display');
  return null;
};