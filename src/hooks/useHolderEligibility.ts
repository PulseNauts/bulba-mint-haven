import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import whaleHolders1 from '../data/whaleHolders.json';
import whaleHolders2 from '../data/whaleHolders2.json';
import holders1 from '../data/holders.json';
import holders2 from '../data/holders2.json';
import { pulsechain } from 'viem/chains';

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

  // Convert address to lowercase for case-insensitive comparison
  const normalizedAddress = address?.toLowerCase();

  // Check if user has already claimed their free pack
  const { data: hasClaimedFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'hasFreePack',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address
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
      enabled: isConnected && !!address
    }
  });

  // Combine whale holders from both files
  const allWhaleHolders = [
    ...whaleHolders1.whaleHolders,
    ...whaleHolders2.whaleHolders
  ];

  // Combine regular holders from both files
  const allHolders = [
    ...holders1.holders,
    ...holders2.holders
  ];

  // Determine tier based on address presence in holders lists
  let tier: HolderTier = 'public';
  let maxFreePacks = 0;
  let maxDiscountedPacks = 0;
  let maxMintAmount = 10; // Default max mint amount for all users

  if (normalizedAddress) {
    if (allWhaleHolders.map(addr => addr.toLowerCase()).includes(normalizedAddress)) {
      tier = 'whale';
      maxFreePacks = hasClaimedFreePack ? 0 : 1; // Only give free pack if not claimed
      maxDiscountedPacks = 5 - Number(discountedPacksMinted || 0); // Subtract already minted discounted packs
    } else if (allHolders.map(addr => addr.toLowerCase()).includes(normalizedAddress)) {
      tier = 'holder';
      maxFreePacks = 0;
      maxDiscountedPacks = 5 - Number(discountedPacksMinted || 0); // Subtract already minted discounted packs
    }
  }

  // Ensure we don't return negative values for remaining packs
  const remainingDiscountedPacks = Math.max(0, maxDiscountedPacks);
  const remainingFreePacks = Math.max(0, maxFreePacks);

  return {
    tier,
    freePacks: remainingFreePacks,
    discountedPacks: remainingDiscountedPacks,
    maxMintAmount,
    isLoading: !isConnected
  };
};