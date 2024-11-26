import { Button } from "@/components/ui/button";
import { Loader2, Crown, Fish } from "lucide-react";
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

  console.log("Rendering MintControls with:", { tier, freePacks, discountedPacks, mintAmount });

  const getBenefitsDisplay = () => {
    if (tier === "whale") {
      return (
        <Alert className="bg-purple-500/10 border-purple-500/20 rounded-lg shadow-sm">
          <Crown className="h-5 w-5 text-purple-500" />
          <AlertDescription>
            <strong className="block mb-1 text-purple-700">Whale Benefits</strong>
            <span>{freePacks} Free Packs</span> · <span>{discountedPacks} Discounted Packs</span>
          </AlertDescription>
        </Alert>
      );
    }

    if (tier === "holder") {
      return (
        <Alert className="bg-cyan-500/10 border-cyan-500/20 rounded-lg shadow-sm">
          <Fish className="h-5 w-5 text-cyan-500" />
          <AlertDescription>
            <strong className="block mb-1 text-cyan-700">Holder Benefits</strong>
            <span>{discountedPacks} Discounted Packs</span>
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const getMintButtonText = () => {
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
        >
          -
        </Button>
        <span className="text-lg font-semibold">{mintAmount}</span>
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

      {isConnected && (
        <div className="space-y-4">
          <Button className="w-full" variant="outline">
            Go to My Profile
          </Button>
        </div>
      )}
    </div>
  );
};
