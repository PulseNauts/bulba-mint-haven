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
  return (
    <div className="space-y-4">
      {isConnected && !isEligible && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are not eligible to mint. Please check the requirements.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
          disabled={mintAmount <= 1 || !isEligible}
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
          disabled={mintAmount >= maxMintAmount || !isEligible}
          className="z-10"
        >
          +
        </Button>
      </div>

      <Button
        className="w-full z-10"
        size="lg"
        onClick={isConnected ? onMint : onConnect}
        disabled={isMinting || (isConnected && !isEligible)}
      >
        {isMinting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {!isConnected 
          ? 'Connect Wallet'
          : !isEligible
          ? 'Not Eligible'
          : `Mint ${mintAmount} Pack${mintAmount > 1 ? 's' : ''}`}
      </Button>
    </div>
  );
};