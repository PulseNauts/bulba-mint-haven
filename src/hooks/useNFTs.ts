import { useAccount, useReadContract } from 'wagmi';
import { pulsechain } from 'viem/chains';
import { useState, useEffect } from 'react';
import { CONTRACT_ABI } from '@/config/abi';
import { CONTRACT_CONFIG } from '@/config/contract';

export interface NFT {
  id: bigint;
  uri: string;
  image?: string;
  name?: string;
}

export const useNFTs = (contractAddress: `0x${string}`) => {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get balance of token ID 1 (pack token)
  const { data: balance } = useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`, 1n],
    chainId: pulsechain.id,
    query: {
      enabled: Boolean(address && isConnected)
    }
  });

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      if (!address || !isConnected || !balance) {
        setNfts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const ownedNFTs: NFT[] = [];
        const balanceNum = Number(balance);
        
        // Fetch URI for each owned token
        for (let i = 0; i < balanceNum; i++) {
          const uri = await fetch(`${CONTRACT_CONFIG.baseUri}/token/${i + 1}`);
          const metadata = await uri.json();
          ownedNFTs.push({
            id: BigInt(i + 1),
            uri: metadata.uri || '',
            image: metadata.image,
            name: metadata.name
          });
        }

        setNfts(ownedNFTs);
      } catch (error) {
        console.error('Error processing NFTs:', error);
        setNfts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTMetadata();
  }, [address, isConnected, balance]);

  return {
    nfts,
    isLoading,
    totalNFTs: nfts.length
  };
};