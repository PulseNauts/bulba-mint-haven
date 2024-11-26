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

  console.log('🔍 [Eligibility Check] Starting eligibility check for address:', address);

  // Check whale status independently
  const { data: isWhale, isLoading: isLoadingWhale } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isWhaleHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address,
      retry: false,
      staleTime: 0,
      gcTime: 0,
      onSuccess: (data) => {
        console.log('🐋 [Whale Check] Raw contract response:', data);
        console.log(`🐋 [Whale Check] Address ${address} Whale status:`, Boolean(data));
      },
      onError: (error) => {
        console.error('❌ [Whale Check] Error checking whale status:', error);
      }
    }
  });

  // Check holder status independently
  const { data: isHolder, isLoading: isLoadingHolder } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isBulbaHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address,
      retry: false,
      staleTime: 0,
      gcTime: 0,
      onSuccess: (data) => {
        console.log('🦈 [Holder Check] Raw contract response:', data);
        console.log(`🦈 [Holder Check] Address ${address} Shark status:`, Boolean(data));
      },
      onError: (error) => {
        console.error('❌ [Holder Check] Error checking holder status:', error);
      }
    }
  });

  // Check free pack claim status for whales
  const { data: hasClaimedFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'hasFreePack',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address && isWhale === true,
      onSuccess: (data) => {
        console.log('🎁 [Free Pack Status] Raw contract response:', data);
        console.log(`🎁 [Free Pack Status] Address ${address} has unclaimed free pack:`, Boolean(data));
      },
      onError: (error) => {
        console.error('❌ [Free Pack Status] Error checking free pack status:', error);
      }
    }
  });

  // Get discounted packs minted
  const { data: discountedPacksMinted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'discountedPacksMintedByUser',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address,
      onSuccess: (data) => {
        console.log('💰 [Discount Status] Raw contract response:', data);
        console.log(`💰 [Discount Status] Address ${address} discounted packs minted:`, Number(data || 0));
      },
      onError: (error) => {
        console.error('❌ [Discount Status] Error checking discounted packs:', error);
      }
    }
  });

  console.log('📊 [Status Debug] Current values:', {
    isWhale: Boolean(isWhale),
    isHolder: Boolean(isHolder),
    hasClaimedFreePack: Boolean(hasClaimedFreePack),
    discountedPacksMinted: Number(discountedPacksMinted || 0)
  });

  // Determine tier and benefits
  let tier: HolderTier = 'public';
  let maxFreePacks = 0;
  let maxDiscountedPacks = 0;
  let maxMintAmount = 10;

  // Important: Check whale status first with strict boolean comparison
  if (isWhale === true) {
    console.log('🐋 [Whale Benefits] Activating whale tier benefits');
    tier = 'whale';
    maxFreePacks = hasClaimedFreePack === true ? 0 : 1;
    maxDiscountedPacks = 5 - Number(discountedPacksMinted || 0);
    console.log(`🐋 [Benefits] Whale tier active - Free packs: ${maxFreePacks}, Discounted packs: ${maxDiscountedPacks}`);
  } else if (isHolder === true) {
    console.log('🦈 [Shark Benefits] Activating shark tier benefits');
    tier = 'holder';
    maxFreePacks = 0;
    maxDiscountedPacks = 5 - Number(discountedPacksMinted || 0);
    console.log(`🦈 [Benefits] Shark tier active - Discounted packs: ${maxDiscountedPacks}`);
  } else {
    console.log('👤 [Public Benefits] No special benefits active');
  }

  // Ensure we don't return negative values
  const remainingDiscountedPacks = Math.max(0, maxDiscountedPacks);
  const remainingFreePacks = Math.max(0, maxFreePacks);

  console.log('🎯 [Final Status]', {
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