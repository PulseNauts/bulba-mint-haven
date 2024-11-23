import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MintControlsProps {
  mintAmount: number;
  setMintAmount: (amount: number) => void;
  isConnected: boolean;
  isMinting: boolean;
  onMint: () => void;
  onConnect: () => void;
  maxMintAmount: number;
  isEligible: boolean;
}

export const MintControls = ({
  mintAmount,
  setMintAmount,
  isConnected,
  isMinting,
  onMint,
  onConnect,
  maxMintAmount,
  isEligible
}: MintControlsProps) => {
  const effectiveMaxMint = maxMintAmount > 0 ? maxMintAmount : 3; // Default max mint if not a holder

  return (
    <div className="space-y-4">
      {isConnected && maxMintAmount > 3 && (
        <Alert className="bg-green-500/10 border-green-500/20 text-green-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Holder Benefits: You can mint up to {maxMintAmount} packs!
          </AlertDescription>
        </Alert>
      )}

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
          onClick={() => setMintAmount(Math.min(effectiveMaxMint, mintAmount + 1))}
          disabled={mintAmount >= effectiveMaxMint}
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