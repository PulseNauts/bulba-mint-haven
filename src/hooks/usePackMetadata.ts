import { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { pulsechain } from 'viem/chains';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from 'wagmi';

export interface PackMetadata {
  id: number;
  image?: string;
  name?: string;
}

// Helper function to format URIs
const formatUri = (uri: string, tokenId: number) => {
  console.log('Original URI:', uri);
  // Check if URI contains {id} placeholder
  if (uri.includes('{id}')) {
    const formattedId = tokenId.toString(16).padStart(64, '0');
    const formattedUri = uri.replace('{id}', formattedId);
    console.log('Formatted URI:', formattedUri);
    return formattedUri;
  }
  return uri;
};

export const usePackMetadata = () => {
  const [packMetadata, setPackMetadata] = useState<PackMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();

  const fetchPackMetadata = async (tokenId: number) => {
    const client = createPublicClient({
      chain: pulsechain,
      transport: http()
    });

    try {
      const uri = await client.readContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'uri',
        args: [BigInt(tokenId)],
      });

      if (uri) {
        const formattedUri = formatUri(uri.toString(), tokenId);
        console.log(`Attempting to fetch metadata from: ${formattedUri}`);
        
        const response = await fetch(formattedUri);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const metadata = await response.json();
        console.log(`Metadata for token ${tokenId}:`, metadata);
        
        return {
          id: tokenId,
          image: metadata.image,
          name: metadata.name
        };
      }
    } catch (error) {
      console.error(`Error fetching metadata for token ${tokenId}:`, error);
    }
    return { id: tokenId };
  };

  useEffect(() => {
    const checkAllTokens = async () => {
      if (!address || !isConnected) return;

      const owned: number[] = [];
      let totalOwned = 0;

      const client = createPublicClient({
        chain: pulsechain,
        transport: http()
      });

      setPackMetadata([]);
      
      for (let tokenId = 1; tokenId <= 222; tokenId++) {
        try {
          const result = await client.readContract({
            address: CONTRACT_CONFIG.address as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'balanceOf',
            args: [address as `0x${string}`, BigInt(tokenId)],
          });

          if (result && result > 0n) {
            owned.push(tokenId);
            totalOwned += Number(result);
            
            const metadata = await fetchPackMetadata(tokenId);
            setPackMetadata(prev => [...prev, metadata]);
          }
        } catch (error) {
          console.error(`Error checking token ID ${tokenId}:`, error);
        }
      }

      if (totalOwned > 0) {
        toast({
          title: "Packs found!",
          description: `Found ${totalOwned} pack(s) with token IDs: ${owned.join(', ')}`,
        });
      }

      setIsLoading(false);
    };

    checkAllTokens();
  }, [address, isConnected, toast]);

  return { packMetadata, setPackMetadata, isLoading };
};