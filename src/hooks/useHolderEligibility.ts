import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { pulsechain } from 'viem/chains';
import { useToast } from "@/components/ui/use-toast";

export type HolderTier = 'whale' | 'holder' | 'public';

export interface HolderEligibility {
  tier: HolderTier;
  freePacks: number;
  discountedPacks: number;
  maxMintAmount: number;
  isLoading: boolean;
  checkEligibility: () => Promise<void>;
}

export const useHolderEligibility = (): HolderEligibility => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  const { data: isWhale, isLoading: isLoadingWhale, refetch: refetchWhale } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isWhaleHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
  });

  const { data: isHolder, isLoading: isLoadingHolder, refetch: refetchHolder } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isBulbaHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
  });

  const { data: hasClaimedFreePack, refetch: refetchFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'hasFreePack',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && Boolean(isWhale),
  });

  const { data: discountedPacksMinted, refetch: refetchDiscounted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'discountedPacksMintedByUser',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && (Boolean(isWhale) || Boolean(isHolder)),
  });

  let tier: HolderTier = 'public';
  let maxFreePacks = 0;
  let maxDiscountedPacks = 0;
  let maxMintAmount = 10;

  if (isWhale) {
    tier = 'whale';
    maxFreePacks = hasClaimedFreePack ? 0 : 1;
    maxDiscountedPacks = 5 - (Number(discountedPacksMinted) || 0);
  } else if (isHolder) {
    tier = 'holder';
    maxFreePacks = 0;
    maxDiscountedPacks = 5 - (Number(discountedPacksMinted) || 0);
  }

  const remainingFreePacks = Math.max(0, maxFreePacks);
  const remainingDiscountedPacks = Math.max(0, maxDiscountedPacks);

  const checkEligibility = async () => {
    await Promise.all([
      refetchWhale(),
      refetchHolder(),
      refetchFreePack(),
      refetchDiscounted()
    ]);
  };

  return {
    tier,
    freePacks: remainingFreePacks,
    discountedPacks: remainingDiscountedPacks,
    maxMintAmount,
    isLoading: isLoadingWhale || isLoadingHolder,
    checkEligibility
  };
};