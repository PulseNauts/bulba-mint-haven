import { Button } from "@/components/ui/button";

interface MintAmountControlsProps {
  mintAmount: number;
  setMintAmount: (amount: number) => void;
  maxMintAmount: number;
}

export const MintAmountControls = ({ 
  mintAmount, 
  setMintAmount, 
  maxMintAmount 
}: MintAmountControlsProps) => {
  return (
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
  );
};