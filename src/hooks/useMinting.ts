import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { useToast } from "@/components/ui/use-toast";
import { pulsechain } from 'viem/chains';
import { HolderTier } from './useHolderEligibility';
import { useContractData } from './useContractData';

export const useMinting = (tier: HolderTier, freePacks: number, discountedPacks: number) => {
  const [mintAmount, setMintAmount] = useState(1);
  const { toast } = useToast();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({ hash });
  const { address } = useAccount();
  const { mintPrice } = useContractData();

  const calculateMintPrice = (amount: number) => {
    let totalPrice = BigInt(0);
    let remainingAmount = amount;

    // Handle free packs for whales (only if they have remaining free packs)
    if (tier === 'whale' && freePacks > 0 && remainingAmount > 0) {
      const freePacksToUse = Math.min(freePacks, remainingAmount);
      remainingAmount -= freePacksToUse;
    }

    // Handle discounted packs for whales and holders (only if they have remaining discounted packs)
    if (['whale', 'holder'].includes(tier) && discountedPacks > 0 && remainingAmount > 0) {
      const discountedAmount = Math.min(discountedPacks, remainingAmount);
      totalPrice += (mintPrice / BigInt(2)) * BigInt(discountedAmount);
      remainingAmount -= discountedAmount;
    }

    // Handle remaining packs at full price
    if (remainingAmount > 0) {
      totalPrice += mintPrice * BigInt(remainingAmount);
    }

    return totalPrice;
  };

  const mint = async () => {
    try {
      const mintPrice = calculateMintPrice(mintAmount);

      await writeContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintPacks',
        args: [BigInt(mintAmount)],
        value: mintPrice,
        chain: pulsechain,
        account: address as `0x${string}`
      });
      
      toast({
        title: "Success!",
        description: `Successfully minted ${mintAmount} pack${mintAmount > 1 ? 's' : ''}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Minting Error",
        description: "Failed to mint. Please try again.",
      });
    }
  };

  return {
    mintAmount,
    setMintAmount,
    mint,
    isMinting: isWaiting
  };
};