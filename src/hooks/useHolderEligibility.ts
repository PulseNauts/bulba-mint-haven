import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';

export type HolderTier = 'none' | 'holder' | 'whale';

export const useHolderEligibility = () => {
  const [tier, setTier] = useState<HolderTier>('none');
  const [freePacks, setFreePacks] = useState(0);
  const [discountedPacks, setDiscountedPacks] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(10);

  const { data: whaleStatus } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isWhale',
    query: {
      enabled: true,
    }
  });

  const { data: holderStatus } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isHolder',
    query: {
      enabled: true,
    }
  });

  const { data: freePacksData } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getFreePacks',
    query: {
      enabled: true,
    }
  });

  const { data: discountedPacksData } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getDiscountedPacks',
    query: {
      enabled: true,
    }
  });

  const checkEligibility = async () => {
    if (whaleStatus) {
      setTier('whale');
      setFreePacks(Number(freePacksData || 0));
      setDiscountedPacks(Number(discountedPacksData || 0));
      setMaxMintAmount(20);
    } else if (holderStatus) {
      setTier('holder');
      setFreePacks(0);
      setDiscountedPacks(Number(discountedPacksData || 0));
      setMaxMintAmount(15);
    } else {
      setTier('none');
      setFreePacks(0);
      setDiscountedPacks(0);
      setMaxMintAmount(10);
    }
  };

  return {
    tier,
    freePacks,
    discountedPacks,
    maxMintAmount,
    checkEligibility
  };
};