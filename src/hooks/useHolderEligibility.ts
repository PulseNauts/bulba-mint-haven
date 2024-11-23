import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { pulsechain } from 'viem/chains';

export const useHolderEligibility = () => {
  const { address, isConnected } = useAccount();

  const { data: maxMintAmount, isError } = useReadContract({
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
  const mintAmount = maxMintAmount !== undefined ? Number(maxMintAmount) : 0;

  return {
    maxMintAmount: mintAmount,
    isEligible: mintAmount > 0 || !isError, // Everyone can mint, but holders get higher allocation
    isLoading: !isConnected
  };
};