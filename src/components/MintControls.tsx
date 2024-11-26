import { Button } from "@/components/ui/button";
import { Loader2, Crown, Fish, Gift, BadgeDollarSign, Percent } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_CONFIG } from "@/config/contract";
import { CONTRACT_ABI } from "@/config/abi";
import { pulsechain } from "viem/chains";
import { useToast } from "@/components/ui/use-toast";

export type HolderTier = "whale" | "holder" | "public";

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
  console.log("MintControls Render:", {
    tier,
    freePacks,
    discountedPacks,
    mintAmount,
    isConnected,
  });

  const getBenefitsDisplay = () => {
    if (tier === "whale") {
      return (
        <div className="space-y-4">
          <Alert className="bg-gradient-to-r from-purple-500 to-purple-700 shadow-lg rounded-lg p-4">
            <div className="flex items-center">
              <Crown className="h-6 w-6 text-white animate-bounce" />
              <AlertDescription className="ml-3 text-white">
                <strong className="block text-lg font-bold">Whale Benefits</strong>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2 bg-white/10 p-2 rounded-md">
                    <Gift className="h-5 w-5 text-green-400" />
                    <span>{freePacks} Free Pack{freePacks !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-2 rounded-md">
                    <BadgeDollarSign className="h-5 w-5 text-blue-400" />
                    <span>{discountedPacks} Discounted Pack{discountedPacks !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </AlertDescription>
            </div>
          </Alert>
        </div>
      );
    }

    if (tier === "holder") {
      return (
        <div className="space-y-4">
          <Alert className="bg-gradient-to-r from-cyan-500 to-cyan-700 shadow-lg rounded-lg p-4">
            <div className="flex items-center">
              <Fish className="h-6 w-6 text-white animate-bounce" />
              <AlertDescription className="ml-3 text-white">
                <strong className="block text-lg font-bold">Holder Benefits</strong>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2 bg-white/10 p-2 rounded-md">
                    <Percent className="h-5 w-5 text-cyan-400" />
                    <span>{discountedPacks} Discounted Pack{discountedPacks !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </AlertDescription>
            </div>
          </Alert>
        </div>
      );
    }

    return null;
  };

  const getMintButtonText = () => {
    if (!isConnected) return "Connect Wallet";

    const packText = mintAmount > 1 ? "Packs" : "Pack";
    if (tier === "whale" && mintAmount <= freePacks) {
      return `Mint ${mintAmount} Free ${packText}`;
    }
    return `Mint ${mintAmount} ${packText}`;
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {getBenefitsDisplay()}

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
          disabled={mintAmount <= 1}
          className="text-lg font-semibold"
        >
          -
        </Button>
        <span className="text-lg font-semibold">{mintAmount}</span>
        <Button
          variant="outline"
          onClick={() => setMintAmount(Math.min(maxMintAmount, mintAmount + 1))}
          disabled={mintAmount >= maxMintAmount}
          className="text-lg font-semibold"
        >
          +
        </Button>
      </div>

      <Button
        onClick={isConnected ? onMint : onConnect}
        disabled={isMinting}
        className="w-full text-lg py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-400 text-white hover:from-green-600 hover:to-green-500 shadow-lg"
      >
        {isMinting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Minting...
          </>
        ) : (
          getMintButtonText()
        )}
      </Button>

      {isConnected && (
        <Button
          className="w-full text-lg py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:from-blue-600 hover:to-blue-500 shadow-lg"
          variant="outline"
        >
          Go to My Profile
        </Button>
      )}
    </div>
  );
};
