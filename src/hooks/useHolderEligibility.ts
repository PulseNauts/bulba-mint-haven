import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
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

  const { data: eligibilityData, isLoading } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getHolderMintEligibility',
    args: [address as `0x${string}`],
    chainId: pulsechain.id,
    query: {
      enabled: Boolean(address && isConnected),
      retry: 2,
    }
  });

  // Convert BigInt to number and handle undefined case
  const tierValue = eligibilityData !== undefined ? Number(eligibilityData) : 0;

  // Determine tier and benefits
  let tier: HolderTier = 'public';
  let freePacks = 0;
  let discountedPacks = 0;
  let maxMintAmount = 10; // Default max mint amount for all users

  if (tierValue >= 2) {
    tier = 'whale';
    freePacks = 1;
    discountedPacks = 5;
  } else if (tierValue === 1) {
    tier = 'holder';
    freePacks = 0;
    discountedPacks = 5;
  }

  return {
    tier,
    freePacks,
    discountedPacks,
    maxMintAmount,
    isLoading: !isConnected || isLoading
  };
};