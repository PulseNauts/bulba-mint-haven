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
      staleTime: 5000,
      gcTime: 30000,
    }
  });

  useEffect(() => {
    const fetchPackData = async () => {
      if (!balance || !isConnected || !address) {
        setPacks([]);
        setIsLoading(false);
        return;
      }

      try {
        const balanceNum = Number(balance);
        const packData: PackData[] = [];

        // Fetch URI for each pack
        for (let i = 0; i < balanceNum; i++) {
          const uri = await fetch(`${CONTRACT_CONFIG.baseUri}/pack/${i + 1}`);
          const metadata = await uri.json();
          packData.push({
            id: i + 1,
            uri: metadata.uri || ''
          });
        }

        setPacks(packData);
      } catch (error) {
        console.error('Error formatting pack data:', error);
        setPacks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackData();
  }, [balance, isConnected, address]);

  return {
    packs,
    isLoading: isLoading || isBalanceLoading,
    totalPacks: packs.length
  };
};