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
        <Alert className="bg-custom-primary/10 border-custom-primary/20 rounded-lg shadow-sm backdrop-blur-sm">
          <Crown className="h-5 w-5 text-custom-primary animate-pulse" />
          <AlertDescription className="flex flex-col gap-1">
            <strong className="text-custom-primary font-bold">Whale Benefits</strong>
            <div className="flex gap-2 text-sm text-custom-light/80">
              <span className="bg-custom-primary/20 px-2 py-0.5 rounded-full">
                {freePacks} Free {freePacks === 1 ? 'Pack' : 'Packs'}
              </span>
              <span className="bg-custom-primary/20 px-2 py-0.5 rounded-full">
                {discountedPacks} Discounted {discountedPacks === 1 ? 'Pack' : 'Packs'}
              </span>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    if (tier === "holder") {
      return (
        <Alert className="bg-custom-secondary/10 border-custom-secondary/20 rounded-lg shadow-sm backdrop-blur-sm">
          <Fish className="h-5 w-5 text-custom-secondary animate-pulse" />
          <AlertDescription className="flex flex-col gap-1">
            <strong className="text-custom-secondary font-bold">Holder Benefits</strong>
            <div className="flex gap-2 text-sm text-custom-light/80">
              <span className="bg-custom-secondary/20 px-2 py-0.5 rounded-full">
                {discountedPacks} Discounted {discountedPacks === 1 ? 'Pack' : 'Packs'}
              </span>
            </div>
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