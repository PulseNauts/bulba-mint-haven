import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import holders from '../../holders.json';
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

  // Get remaining free mints from contract
  const { data: usedFreeMints } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getFreeMintCount',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address
    }
  });

  // Get remaining discounted mints from contract
  const { data: usedDiscountedMints } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getDiscountedMintCount',
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address
    }
  });

  // Determine tier based on address presence in holders lists
  let tier: HolderTier = 'public';
  let maxFreePacks = 0;
  let maxDiscountedPacks = 0;
  let maxMintAmount = 10; // Default max mint amount for all users

  if (normalizedAddress) {
    if (holders.whaleHolders.map(addr => addr.toLowerCase()).includes(normalizedAddress)) {
      tier = 'whale';
      maxFreePacks = 1;
      maxDiscountedPacks = 5;
    } else if (holders.holders.map(addr => addr.toLowerCase()).includes(normalizedAddress)) {
      tier = 'holder';
      maxFreePacks = 0;
      maxDiscountedPacks = 5;
    }
  }

  // Calculate remaining packs based on contract data
  const remainingFreePacks = Math.max(0, maxFreePacks - (Number(usedFreeMints || 0)));
  const remainingDiscountedPacks = Math.max(0, maxDiscountedPacks - (Number(usedDiscountedMints || 0)));

  return {
    tier,
    freePacks: remainingFreePacks,
    discountedPacks: remainingDiscountedPacks,
    maxMintAmount,
    isLoading: !isConnected
  };
};