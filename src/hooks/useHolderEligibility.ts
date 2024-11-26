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

  console.group('🔍 [Eligibility Check] Initialization');
  console.log('Connected Address:', address);
  console.log('Is Connected:', isConnected);

  // Check whale status
  console.log('🐋 [Whale Check] Starting...');
  const { data: isWhale, isLoading: isLoadingWhale } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isWhaleHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
    onSuccess: (data) => {
      console.log('🐋 [Whale Check] Success - Raw Response:', data);
      console.log(`🐋 [Whale Check] Address ${address} Whale Status:`, Boolean(data));
    },
    onError: (error) => {
      console.error('❌ [Whale Check] Error:', error);
    },
  });

  // Check holder status
  console.log('🦈 [Holder Check] Starting...');
  const { data: isHolder, isLoading: isLoadingHolder } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isBulbaHolder',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
    onSuccess: (data) => {
      console.log('🦈 [Holder Check] Success - Raw Response:', data);
      console.log(`🦈 [Holder Check] Address ${address} Holder Status:`, Boolean(data));
    },
    onError: (error) => {
      console.error('❌ [Holder Check] Error:', error);
    },
  });

  // Check free pack claim status
  console.log('🎁 [Free Pack Check] Starting...');
  const { data: hasClaimedFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'hasFreePack',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && Boolean(isWhale),
    onSuccess: (data) => {
      console.log('🎁 [Free Pack Check] Success - Raw Response:', data);
      console.log(`🎁 [Free Pack Check] Address ${address} Free Pack Claimed Status:`, Boolean(data));
    },
    onError: (error) => {
      console.error('❌ [Free Pack Check] Error:', error);
    },
  });

  // Check discounted packs minted
  console.log('💰 [Discounted Packs Check] Starting...');
  const { data: discountedPacksMinted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'discountedPacksMintedByUser',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && (Boolean(isWhale) || Boolean(isHolder)),
    onSuccess: (data) => {
      console.log('💰 [Discounted Packs Check] Success - Raw Response:', data);
      console.log(`💰 [Discounted Packs Check] Address ${address} Discounted Packs Minted:`, Number(data || 0));
    },
    onError: (error) => {
      console.error('❌ [Discounted Packs Check] Error:', error);
    },
  });

  console.groupEnd();

  // Calculate eligibility
  console.group('📊 [Eligibility Calculation]');
  console.log('Initial Values:', {
    isWhale: Boolean(isWhale),
    isHolder: Boolean(isHolder),
    hasClaimedFreePack: Boolean(hasClaimedFreePack),
    discountedPacksMinted: Number(discountedPacksMinted || 0),
  });

  let tier: HolderTier = 'public';
  let maxFreePacks = 0;
  let maxDiscountedPacks = 0;
  let maxMintAmount = 10;

  if (isWhale) {
    console.log('🐋 [Whale Benefits] Whale status confirmed.');
    tier = 'whale';
    maxFreePacks = hasClaimedFreePack ? 0 : 1;
    maxDiscountedPacks = 5 - (Number(discountedPacksMinted) || 0);
  } else if (isHolder) {
    console.log('🦈 [Holder Benefits] Holder status confirmed.');
    tier = 'holder';
    maxFreePacks = 0;
    maxDiscountedPacks = 5 - (Number(discountedPacksMinted) || 0);
  } else {
    console.log('👤 [Public Benefits] No special status detected.');
  }

  const remainingFreePacks = Math.max(0, maxFreePacks);
  const remainingDiscountedPacks = Math.max(0, maxDiscountedPacks);

  console.log('Final Eligibility:', {
    tier,
    remainingFreePacks,
    remainingDiscountedPacks,
    maxMintAmount,
  });
  console.groupEnd();

  return {
    tier,
    freePacks: remainingFreePacks,
    discountedPacks: remainingDiscountedPacks,
    maxMintAmount,
    isLoading: isLoadingWhale || isLoadingHolder,
  };
};
