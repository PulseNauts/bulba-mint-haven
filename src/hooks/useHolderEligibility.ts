import { useAccount } from 'wagmi';
import holders from '../../holders.json';

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

  // Determine tier based on address presence in holders lists
  let tier: HolderTier = 'public';
  let freePacks = 0;
  let discountedPacks = 0;
  let maxMintAmount = 10; // Default max mint amount for all users

  if (normalizedAddress) {
    if (holders.whaleHolders.map(addr => addr.toLowerCase()).includes(normalizedAddress)) {
      tier = 'whale';
      freePacks = 1;
      discountedPacks = 5;
    } else if (holders.holders.map(addr => addr.toLowerCase()).includes(normalizedAddress)) {
      tier = 'holder';
      freePacks = 0;
      discountedPacks = 5;
    }
  }

  return {
    tier,
    freePacks,
    discountedPacks,
    maxMintAmount,
    isLoading: !isConnected
  };
};