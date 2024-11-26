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
}

export const MintControls = ({
  mintAmount,
  setMintAmount,
  isConnected,
  isMinting,
  onMint,
  onConnect,
  maxMintAmount,
}: MintControlsProps) => {
  const { address } = useAccount();
  const { toast } = useToast();

  console.log(`Checking eligibility for address: ${address}`);

  // Fetch eligibility status from contract
  const { data: isWhale } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "isWhaleHolder",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
  });

  const { data: isHolder } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "isBulbaHolder",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
  });

  const { data: hasClaimedFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "hasFreePack",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && Boolean(isWhale),
  });

  const { data: discountedPacksMinted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "discountedPacksMintedByUser",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && (Boolean(isWhale) || Boolean(isHolder)),
  });

  let tier: HolderTier = "public";
  let maxFreePacks = 0;
  let maxDiscountedPacks = 0;

  if (isWhale) {
    console.log("Whale status detected");
    tier = "whale";
    maxFreePacks = hasClaimedFreePack ? 0 : 1;
    maxDiscountedPacks = 5 - (Number(discountedPacksMinted) || 0);
    console.log(`Whale benefits: ${maxFreePacks} free packs, ${maxDiscountedPacks} discounted packs remaining`);
  } else if (isHolder) {
    console.log("Holder status detected");
    tier = "holder";
    maxFreePacks = 0;
    maxDiscountedPacks = 5 - (Number(discountedPacksMinted) || 0);
    console.log(`Holder benefits: ${maxDiscountedPacks} discounted packs remaining`);
  } else {
    console.log("Public tier detected - no special benefits");
  }

  const freePacks = Math.max(0, maxFreePacks);
  const discountedPacks = Math.max(0, maxDiscountedPacks);

  const getBenefitsDisplay = () => {
    if (tier === "whale") {
      return (
        <Alert className="bg-purple-500/10 border-purple-500/20 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Crown className="h-5 w-5 text-purple-500" />
            <AlertDescription className="flex flex-col gap-2 ml-3">
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
          </div>
        </Alert>
      );
    } else if (tier === "holder") {
      return (
        <Alert className="bg-cyan-500/10 border-cyan-500/20 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Fish className="h-5 w-5 text-cyan-500" />
            <AlertDescription className="flex flex-col gap-2 ml-3">
              <span className="font-semibold text-cyan-500">Holder Benefits Active:</span>
              <div className="flex items-center gap-2 text-cyan-500 bg-cyan-500/10 p-2 rounded-md mt-2">
                <Percent className="h-4 w-4 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">50% OFF Packs</span>
                  <span className="text-xs">{discountedPacks} remaining</span>
                </div>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      );
    }
    return null;
  };

  const getMintButtonText = () => {
    const packText = mintAmount > 1 ? "Packs" : "Pack";
    if (tier === "whale" && mintAmount <= freePacks) {
      return `Mint ${mintAmount} FREE ${packText}`;
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
