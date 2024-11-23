import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { pulsechain } from 'viem/chains';

export const useHolderEligibility = () => {
  const { address, isConnected } = useAccount();

  const { data: maxMintAmount } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getHolderMintEligibility',
    args: [address as `0x${string}`],
    chainId: pulsechain.id,
    query: {
      enabled: Boolean(address && isConnected),
    }
  });

  return {
    maxMintAmount: maxMintAmount ? Number(maxMintAmount) : 0,
    isEligible: maxMintAmount ? Number(maxMintAmount) > 0 : false
  };
};