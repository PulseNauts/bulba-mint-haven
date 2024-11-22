import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { pulsechain } from 'viem/chains';

export interface PackData {
  id: number;
  uri: string;
}

export const usePackData = () => {
  const [packs, setPacks] = useState<PackData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();

  // Get balance of token ID 1 (pack token)
  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`, 1n],
    chainId: pulsechain.id,
    query: {
      enabled: Boolean(address && isConnected),
      staleTime: 5000, // Consider data fresh for 5 seconds
      gcTime: 30000, // Keep data in garbage collection for 30 seconds
    }
  });

  // Get token IDs owned by user
  const { data: tokenIds, isLoading: isTokenIdsLoading } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getPacksMetadataByOwner',
    args: [address as `0x${string}`],
    chainId: pulsechain.id,
    query: {
      enabled: Boolean(address && isConnected && balance && balance > 0n),
      staleTime: 5000,
      gcTime: 30000,
    }
  });

  useEffect(() => {
    const fetchPackData = async () => {
      if (!tokenIds || !isConnected) {
        setPacks([]);
        setIsLoading(false);
        return;
      }

      try {
        const formattedPacks = tokenIds.map(pack => ({
          id: Number(pack.tokenId),
          uri: pack.uri
        }));

        setPacks(formattedPacks);
      } catch (error) {
        console.error('Error formatting pack data:', error);
        setPacks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackData();
  }, [tokenIds, isConnected]);

  return {
    packs,
    isLoading: isLoading || isBalanceLoading || isTokenIdsLoading,
    totalPacks: packs.length
  };
};