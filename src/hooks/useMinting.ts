import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { useToast } from "@/components/ui/use-toast";
import { pulsechain } from 'viem/chains';
import { HolderTier } from './useHolderEligibility';

export const useMinting = (tier: HolderTier, freePacks: number, discountedPacks: number) => {
  const [mintAmount, setMintAmount] = useState(1);
  const { toast } = useToast();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({ hash });
  const { address } = useAccount();

  const calculateMintPrice = (amount: number) => {
    let totalPrice = BigInt(0);
    let remainingAmount = amount;

    // Handle free packs for whales
    if (tier === 'whale' && freePacks > 0 && remainingAmount > 0) {
      const freePacksUsed = Math.min(freePacks, remainingAmount);
      remainingAmount -= freePacksUsed;
    }

    // Handle discounted packs for whales and holders
    if ((tier === 'whale' || tier === 'holder') && discountedPacks > 0 && remainingAmount > 0) {
      const discountedAmount = Math.min(discountedPacks, remainingAmount);
      totalPrice += BigInt(CONTRACT_CONFIG.discountedPrice) * BigInt(discountedAmount);
      remainingAmount -= discountedAmount;
    }

    // Handle remaining packs at full price
    if (remainingAmount > 0) {
      totalPrice += BigInt(CONTRACT_CONFIG.mintPrice) * BigInt(remainingAmount);
    }

    return totalPrice;
  };

  const mint = async () => {
    try {
      const mintPrice = calculateMintPrice(mintAmount);

      console.log('Minting Details:', {
        mintAmount,
        freePacks,
        discountedPacks,
        mintPrice: mintPrice.toString(),
      });

      await writeContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintPacks',
        args: [mintAmount],
        value: mintPrice,
        account: address as `0x${string}`,
        chain: pulsechain,
      });

      toast({
        title: "Success!",
        description: `Successfully minted ${mintAmount} pack${mintAmount > 1 ? 's' : ''}!`,
      });
    } catch (error) {
      console.error('Minting Error:', error);
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
    isMinting: isWaiting,
  };
};
