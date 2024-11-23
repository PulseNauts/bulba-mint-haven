import { Button } from "@/components/ui/button";
import { Loader2, Crown, BadgeCheck, BadgeDollarSign, Gift, Percent } from "lucide-react";
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
  const getBenefitsDisplay = () => {
    if (tier === 'whale') {
      return (
        <div className="space-y-4">
          <Alert className="bg-purple-500/10 border-purple-500/20">
            <Crown className="h-5 w-5 text-purple-500" />
            <AlertDescription className="flex items-center gap-2">
              <span className="font-semibold text-purple-500">Whale Benefits:</span>
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-green-500">
              <Gift className="h-4 w-4" />
              <span>1 FREE Pack</span>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Value: {CONTRACT_CONFIG.mintPrice / 1e18} PLS
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-blue-500">
              <BadgeDollarSign className="h-4 w-4" />
              <span>{discountedPacks} Discounted Packs</span>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                50% OFF
              </Badge>
            </div>
          </div>
        </div>
      );
    } else if (tier === 'holder') {
      return (
        <div className="space-y-4">
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <BadgeCheck className="h-5 w-5 text-blue-500" />
            <AlertDescription className="flex items-center gap-2">
              <span className="font-semibold text-blue-500">Holder Benefits:</span>
            </AlertDescription>
          </Alert>
          <div className="flex items-center gap-2 text-blue-500">
            <Percent className="h-4 w-4" />
            <span>{discountedPacks} Discounted Packs</span>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
              50% OFF
            </Badge>
          </div>
        </div>
      );
    }
    return null;
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
        {!isConnected 
          ? 'Connect Wallet'
          : `Mint ${mintAmount} Pack${mintAmount > 1 ? 's' : ''}`}
      </Button>
    </div>
  );
};