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

  // Get all packs metadata owned by the user
  const { data: packsMetadata, isSuccess: metadataLoaded } = useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'getPacksMetadataByOwner',
    args: [address as `0x${string}`],
    chainId: pulsechain.id,
    query: {
      enabled: Boolean(address && isConnected)
    }
  });

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      if (!address || !isConnected || !packsMetadata || !metadataLoaded) {
        setNfts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Map over the packs metadata and fetch additional metadata if available
        const ownedNFTs: NFT[] = packsMetadata.map(pack => ({
          id: pack.tokenId,
          uri: pack.uri
        }));

        setNfts(ownedNFTs);
      } catch (error) {
        console.error('Error processing NFTs:', error);
        setNfts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTMetadata();
  }, [address, isConnected, packsMetadata, metadataLoaded]);

  return {
    nfts,
    isLoading: isLoading || !metadataLoaded,
    totalNFTs: nfts.length
  };
};