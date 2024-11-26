import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { pulsechain } from 'viem/chains';
import { useToast } from "@/components/ui/use-toast";
import { HolderTier } from '@/hooks/useHolderEligibility';
import { BenefitsDisplay } from "./mint/BenefitsDisplay";
import { MintAmountControls } from "./mint/MintAmountControls";

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
      <BenefitsDisplay 
        tier={currentTier} 
        freePacks={currentFreePacks} 
        discountedPacks={currentDiscountedPacks} 
      />

      <MintAmountControls 
        mintAmount={mintAmount}
        setMintAmount={setMintAmount}
        maxMintAmount={maxMintAmount}
      />

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