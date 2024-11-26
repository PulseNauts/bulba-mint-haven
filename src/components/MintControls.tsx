import { Button } from "@/components/ui/button";
import { Loader2, Crown, BadgeCheck, BadgeDollarSign, Gift, Percent, Fish } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HolderTier } from "@/hooks/useHolderEligibility";
import { Badge } from "@/components/ui/badge";
import { CONTRACT_CONFIG } from "@/config/contract";

interface MintControlsProps {
  mintAmount: number;
  setMintAmount: (amount: number) => void;
  isConnected: boolean;
  isMinting: boolean;
  onMint: () => void;
  onConnect: () => void;
  maxMintAmount: number;
  tier: HolderTier;
  freePacks: number;
  discountedPacks: number;
}

export const MintControls = ({
  mintAmount,
  setMintAmount,
  isConnected,
  isMinting,
  onMint,
  onConnect,
  maxMintAmount,
  tier,
  freePacks,
  discountedPacks,
}: MintControlsProps) => {
  console.log('Rendering MintControls with:', { tier, freePacks, discountedPacks, mintAmount });

  const getBenefitsDisplay = () => {
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

  const getMintButtonText = () => {
    if (!isConnected) return 'Connect Wallet';

    const packText = mintAmount > 1 ? 'Packs' : 'Pack';
    if (tier === 'whale' && mintAmount <= freePacks) {
      console.log('Displaying free mint button text');
      return `Mint ${mintAmount} FREE ${packText}`;
    }
    console.log('Displaying standard mint button text');
    return `Mint ${mintAmount} ${packText}`;
  };

  return (
    <div className="space-y-4">
      {getBenefitsDisplay()}

      <div className="flex gap-4 items-center justify-center">
        <Button
          variant="outline"
          onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
          disabled={mintAmount <= 1}
        >
          -
        </Button>
        <span className="text-lg font-medium min-w-[2ch] text-center">{mintAmount}</span>
        <Button
          variant="outline"
          onClick={() => setMintAmount(Math.min(maxMintAmount, mintAmount + 1))}
          disabled={mintAmount >= maxMintAmount}
        >
          +
        </Button>
      </div>

      <Button
        onClick={isConnected ? onMint : onConnect}
        disabled={isMinting}
        className="w-full"
      >
        {isMinting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting...
          </>
        ) : (
          getMintButtonText()
        )}
      </Button>
    </div>
  );
};