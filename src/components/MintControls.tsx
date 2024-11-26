import { Button } from "@/components/ui/button";
import { Loader2, Crown, Fish } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_CONFIG } from "@/config/contract";
import { CONTRACT_ABI } from "@/config/abi";
import { pulsechain } from "viem/chains";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

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

  const [tier, setTier] = useState<HolderTier>("public");
  const [freePacks, setFreePacks] = useState(0);
  const [discountedPacks, setDiscountedPacks] = useState(0);

  const { data: isWhale, refetch: refetchWhale } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "isWhaleHolder",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
  });

  const { data: isHolder, refetch: refetchHolder } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "isBulbaHolder",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
  });

  const { data: hasClaimedFreePack, refetch: refetchFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "hasFreePack",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && Boolean(isWhale),
  });

  const { data: discountedPacksMinted, refetch: refetchDiscounted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "discountedPacksMintedByUser",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && (Boolean(isWhale) || Boolean(isHolder)),
  });

  useEffect(() => {
    if (!isConnected || !address) return;

    const updateEligibility = async () => {
      console.log(`Fetching eligibility for address: ${address}`);
      try {
        await Promise.all([refetchWhale(), refetchHolder(), refetchFreePack(), refetchDiscounted()]);

        if (isWhale) {
          console.log("Whale status detected");
          setTier("whale");
          setFreePacks(hasClaimedFreePack ? 0 : 1);
          setDiscountedPacks(5 - (Number(discountedPacksMinted) || 0));
        } else if (isHolder) {
          console.log("Holder status detected");
          setTier("holder");
          setFreePacks(0);
          setDiscountedPacks(5 - (Number(discountedPacksMinted) || 0));
        } else {
          console.log("Public tier detected - no special benefits");
          setTier("public");
          setFreePacks(0);
          setDiscountedPacks(0);
        }

        console.log("Eligibility status updated:", {
          tier,
          freePacks,
          discountedPacks,
        });
      } catch (error) {
        console.error("Error fetching eligibility status:", error);
      }
    };

    updateEligibility();
  }, [address, isConnected, isWhale, isHolder, hasClaimedFreePack, discountedPacksMinted]);

  const getBenefitsDisplay = () => {
    if (tier === "whale") {
      return (
        <Alert className="bg-purple-500/10 border-purple-500/20 rounded-lg shadow-sm">
          <Crown className="h-5 w-5 text-purple-500" />
          <AlertDescription>
            <strong>Whale Benefits Active:</strong>
            <p>{freePacks} Free Packs</p>
            <p>{discountedPacks} Discounted Packs</p>
          </AlertDescription>
        </Alert>
      );
    }

    if (tier === "holder") {
      return (
        <Alert className="bg-cyan-500/10 border-cyan-500/20 rounded-lg shadow-sm">
          <Fish className="h-5 w-5 text-cyan-500" />
          <AlertDescription>
            <strong>Holder Benefits Active:</strong>
            <p>{discountedPacks} Discounted Packs</p>
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
        <span className="text-lg font-medium">{mintAmount}</span>
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
