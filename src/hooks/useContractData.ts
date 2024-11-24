import { useReadContract } from "wagmi";
import { CONTRACT_CONFIG } from "@/config/contract";
import { CONTRACT_ABI } from "@/config/abi";
import { pulsechain } from 'viem/chains';

export const useContractData = () => {
  const { data: totalMinted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'totalPacksMinted',
    chainId: pulsechain.id,
  });

  const { data: totalPacks } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'TOTAL_PACKS',
    chainId: pulsechain.id,
  });

  const { data: mintPrice } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'mintPrice',
    chainId: pulsechain.id,
  });

  return {
    totalMinted: Number(totalMinted || 0),
    totalPacks: Number(totalPacks || CONTRACT_CONFIG.totalPacks),
    mintPrice: mintPrice || BigInt(CONTRACT_CONFIG.mintPrice)
  };
};