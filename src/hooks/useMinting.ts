import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { useToast } from "@/components/ui/use-toast";
import { pulsechain } from 'viem/chains';
import { HolderTier } from './useHolderEligibility';

export const useMinting = (tier: HolderTier, freePacks: number, discountedPacks: number) => {
  const [mintAmount, setMintAmount] = useState(1);
  const { toast } = useToast();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({ hash });
  const { address } = useAccount();

  // Fetch mint price from contract
  const { data: mintPrice, isLoading: isPriceLoading } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'mintPrice',
    chainId: pulsechain.id,
  });

  const calculateMintPrice = (amount: number) => {
    if (!mintPrice) return BigInt(0);
    
    let totalPrice = BigInt(0);
    let remainingAmount = amount;

    // Handle free packs for whales only
    if (tier === 'whale' && freePacks > 0 && remainingAmount > 0) {
      const freePacksToUse = Math.min(freePacks, remainingAmount);
      remainingAmount -= freePacksToUse;
    }

    // Handle discounted packs for both whales and holders (sharks)
    if (remainingAmount > 0) {
      if (tier === 'whale' || tier === 'holder') {
        const discountedAmount = Math.min(discountedPacks, remainingAmount);
        if (discountedAmount > 0) {
          totalPrice += (mintPrice * BigInt(discountedAmount)) / BigInt(2); // 50% discount
          remainingAmount -= discountedAmount;
        }
      }
    }

    // Handle remaining packs at full price
    if (remainingAmount > 0) {
      totalPrice += mintPrice * BigInt(remainingAmount);
    }

    return totalPrice;
  };

  const mint = async () => {
    try {
      if (!address || !mintPrice) return;

      const calculatedPrice = calculateMintPrice(mintAmount);

      await writeContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintPacks',
        args: [BigInt(mintAmount)],
        value: calculatedPrice,
        chain: pulsechain,
        account: address as `0x${string}`,
      });
      
      toast({
        title: "Success!",
        description: `Successfully minted ${mintAmount} pack${mintAmount > 1 ? 's' : ''}!`,
      });
    } catch (error: any) {
      console.error('Minting error:', error);
      toast({
        variant: "destructive",
        title: "Minting Error",
        description: error?.message || "Failed to mint. Please try again.",
      });
    }
  };

  return {
    mintAmount,
    setMintAmount,
    mint,
    isMinting: isPending || isWaiting,
    isPriceLoading
  };
};