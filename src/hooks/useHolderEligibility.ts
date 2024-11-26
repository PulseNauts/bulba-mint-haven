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
}

export const useHolderEligibility = (): HolderEligibility => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  // Check if user is a whale holder with detailed logging
  const { data: isWhale, isLoading: isLoadingWhale } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isWhaleHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address,
      onSuccess: (data) => {
        console.log(`[Whale Check] Address ${address} Whale status:`, data);
        console.log('[Whale Check] Raw contract response:', data);
        if (data) {
          toast({
            title: "Whale Benefits Active",
            description: "You have access to whale-tier benefits including free and discounted packs!",
          });
        }
      },
      onError: (error) => {
        console.error('[Whale Check] Error checking whale status:', error);
      }
    }
  });

  // Check if user is a regular holder with detailed logging
  const { data: isHolder, isLoading: isLoadingHolder } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isBulbaHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address && !isWhale,
      onSuccess: (data) => {
        console.log(`[Holder Check] Address ${address} Shark status:`, data);
        if (data && !isWhale) {
          toast({
            title: "Shark Benefits Active",
            description: "You have access to discounted packs!",
          });
        }
      },
      onError: (error) => {
        console.error('[Holder Check] Error checking holder status:', error);
      }
    }
  });

  // Check if user has already claimed their free pack
  const { data: hasClaimedFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'hasFreePack',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address && isWhale,
      onSuccess: (data) => {
        console.log(`[Free Pack Status] Address ${address} has claimed free pack:`, data);
      }
    }
  });

  // Get number of discounted packs already minted by user
  const { data: discountedPacksMinted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'discountedPacksMintedByUser',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address && (isWhale || isHolder),
      onSuccess: (data) => {
        console.log(`[Discount Status] Address ${address} discounted packs minted:`, Number(data || 0));
      }
    }
  });

  // Determine tier and benefits with enhanced logging
  let tier: HolderTier = 'public';
  let maxFreePacks = 0;
  let maxDiscountedPacks = 0;
  let maxMintAmount = 10;

  console.log('[Status Debug] Current values:', {
    isWhale,
    isHolder,
    hasClaimedFreePack,
    discountedPacksMinted: Number(discountedPacksMinted || 0)
  });

  if (isWhale) {
    console.log('[Whale Benefits] Activating whale tier benefits');
    tier = 'whale';
    maxFreePacks = hasClaimedFreePack ? 0 : 1;
    maxDiscountedPacks = 5 - Number(discountedPacksMinted || 0);
    console.log(`[Benefits] Whale tier active - Free packs: ${maxFreePacks}, Discounted packs: ${maxDiscountedPacks}`);
  } else if (isHolder) {
    console.log('[Shark Benefits] Activating shark tier benefits');
    tier = 'holder';
    maxFreePacks = 0;
    maxDiscountedPacks = 5 - Number(discountedPacksMinted || 0);
    console.log(`[Benefits] Shark tier active - Discounted packs: ${maxDiscountedPacks}`);
  } else {
    console.log('[Benefits] Public tier active - No special benefits');
  }

  // Ensure we don't return negative values for remaining packs
  const remainingDiscountedPacks = Math.max(0, maxDiscountedPacks);
  const remainingFreePacks = Math.max(0, maxFreePacks);

  console.log('[Final Status]', {
    tier,
    remainingFreePacks,
    remainingDiscountedPacks,
    maxMintAmount
  });

  return {
    tier,
    freePacks: remainingFreePacks,
    discountedPacks: remainingDiscountedPacks,
    maxMintAmount,
    isLoading: isLoadingWhale || isLoadingHolder
  };
};