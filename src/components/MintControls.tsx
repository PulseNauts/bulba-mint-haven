import { Button } from "@/components/ui/button";
import { Loader2, Crown, Fish } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { pulsechain } from 'viem/chains';
import { useToast } from "@/components/ui/use-toast";
import { HolderTier } from '@/hooks/useHolderEligibility';

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
  tier: currentTier,
  freePacks: currentFreePacks,
  discountedPacks: currentDiscountedPacks,
}: MintControlsProps) => {
  const { address } = useAccount();
  const { toast } = useToast();

  console.log(`Checking eligibility for address: ${address}`);

  const { data: isWhale, isLoading: isLoadingWhale, refetch: refetchWhale } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isWhaleHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address,
    }
  });

  const { data: isHolder, isLoading: isLoadingHolder, refetch: refetchHolder } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isBulbaHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address,
    }
  });

  const { data: hasClaimedFreePack, refetch: refetchFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'hasFreePack',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address && Boolean(isWhale),
    }
  });

  const { data: discountedPacksMinted, refetch: refetchDiscounted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'discountedPacksMintedByUser',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address && (Boolean(isWhale) || Boolean(isHolder)),
    }
  });

  const checkEligibility = async () => {
    console.log('Refreshing eligibility status...');
    try {
      await Promise.all([
        refetchWhale(),
        refetchHolder(),
        refetchFreePack(),
        refetchDiscounted()
      ]);
      console.log('Eligibility status refreshed successfully');
      toast({
        title: "Status Updated",
        description: `Current tier: ${currentTier.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error refreshing eligibility:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh eligibility status.",
      });
    }
  };

  console.log('Rendering MintControls with:', { currentTier, currentFreePacks, currentDiscountedPacks, mintAmount });

  const getBenefitsDisplay = () => {
    if (!currentTier) {
      console.log('No tier detected, skipping benefits display');
      return null;
    }

    if (currentTier === 'whale') {
      console.log('Displaying whale benefits:', { currentFreePacks, currentDiscountedPacks });
      return (
        <Alert className="bg-purple-500/10 border-purple-500/20">
          <Crown className="h-5 w-5 text-purple-500" />
          <AlertDescription>
            <strong>Whale Benefits Active:</strong>
            <p>Free Packs: {currentFreePacks}</p>
            <p>Discounted Packs: {currentDiscountedPacks}</p>
          </AlertDescription>
        </Alert>
      );
    }

    if (currentTier === 'holder') {
      console.log('Displaying holder benefits:', { currentDiscountedPacks });
      return (
        <Alert className="bg-cyan-500/10 border-cyan-500/20">
          <Fish className="h-5 w-5 text-cyan-500" />
          <AlertDescription>
            <strong>Holder Benefits Active:</strong>
            <p>Discounted Packs: {currentDiscountedPacks}</p>
          </AlertDescription>
        </Alert>
      );
    }

    console.log('No special benefits to display');
    return null;
  };

  const getMintButtonText = () => {
    if (!isConnected) return 'Connect Wallet';

    const packText = mintAmount > 1 ? 'Packs' : 'Pack';
    if (currentTier === 'whale' && mintAmount <= currentFreePacks) {
      console.log('Displaying free mint button text');
      return `Mint ${mintAmount} FREE ${packText}`;
    }
    console.log('Displaying standard mint button text');
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
        <span className="text-lg font-medium min-w-[2ch] text-center">{mintAmount}</span>
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

      <Button
        onClick={() => {
          toast({
            title: "Test Button Clicked",
            description: "This confirms that Lovable's backend is properly handling code updates.",
          });
        }}
        className="w-full"
        variant="secondary"
      >
        Test Button
      </Button>

      {isConnected && (
        <div className="space-y-4">
          <Button className="w-full" variant="outline">
            Go to My Profile
          </Button>
          <Button className="w-full" variant="outline" onClick={checkEligibility}>
            Check Holder Status
          </Button>
          <Button className="w-full" variant="outline">
            Placeholder Button
          </Button>
        </div>
      )}
    </div>
  );
};