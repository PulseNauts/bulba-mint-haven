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
  discountedPacks
}: MintControlsProps) => {
  console.log('MintControls Render:', {
    tier,
    freePacks,
    discountedPacks,
    mintAmount,
    isConnected
  });

  const getBenefitsDisplay = () => {
    if (tier === 'whale') {
      console.log('Rendering Whale Benefits:', { freePacks, discountedPacks });
      return (
        <div className="space-y-4">
          <Alert className="bg-purple-500/10 border-purple-500/20">
            <Crown className="h-5 w-5 text-purple-500" />
            <AlertDescription className="flex flex-col gap-2">
              <span className="font-semibold text-purple-500">Whale Benefits Active:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-2 rounded-md">
                  <Gift className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">FREE Packs</span>
                    <span className="text-xs">{freePacks} remaining</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-500 bg-blue-500/10 p-2 rounded-md">
                  <BadgeDollarSign className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">50% OFF Packs</span>
                    <span className="text-xs">{discountedPacks} remaining</span>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    } else if (tier === 'holder') {
      console.log('Rendering Holder Benefits:', { discountedPacks });
      return (
        <div className="space-y-4">
          <Alert className="bg-cyan-500/10 border-cyan-500/20">
            <Fish className="h-5 w-5 text-cyan-500" />
            <AlertDescription className="flex flex-col gap-2">
              <span className="font-semibold text-cyan-500">Shark Benefits Active:</span>
              <div className="flex items-center gap-2 text-cyan-500 bg-cyan-500/10 p-2 rounded-md mt-2">
                <Percent className="h-4 w-4 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">50% OFF Packs</span>
                  <span className="text-xs">{discountedPacks} remaining</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    console.log('No special benefits to render');
    return null;
  };

  const getMintButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    
    const packText = mintAmount > 1 ? 'Packs' : 'Pack';
    if (tier === 'whale' && mintAmount <= freePacks) {
      return `Mint ${mintAmount} FREE ${packText}`;
    }
    return `Mint ${mintAmount} ${packText}`;
  };

  return (
    <div className="space-y-4">
      {isConnected && getBenefitsDisplay()}

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
          disabled={mintAmount <= 1}
          className="z-10"
        >
          -
        </Button>
        <span className="flex items-center justify-center w-16 text-lg">
          {mintAmount}
        </span>
        <Button
          variant="outline"
          onClick={() => setMintAmount(Math.min(maxMintAmount, mintAmount + 1))}
          disabled={mintAmount >= maxMintAmount}
          className="z-10"
        >
          +
        </Button>
      </div>

      <Button
        className="w-full z-10"
        size="lg"
        onClick={isConnected ? onMint : onConnect}
        disabled={isMinting}
      >
        {isMinting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {getMintButtonText()}
      </Button>
    </div>
  );
};