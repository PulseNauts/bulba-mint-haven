import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { useToast } from "@/components/ui/use-toast";
import { pulsechain } from 'viem/chains';
import { HolderTier } from '@/components/MintControls';
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

    // Handle free packs for whales first (if they have any remaining)
    if (tier === 'whale' && freePacks > 0 && remainingAmount > 0) {
      const freePacksToUse = Math.min(freePacks, remainingAmount);
      remainingAmount -= freePacksToUse;
    }

    // Handle discounted packs for both whales and holders
    if ((tier === 'whale' || tier === 'holder') && discountedPacks > 0 && remainingAmount > 0) {
      const discountedPacksToUse = Math.min(discountedPacks, remainingAmount);
      // Apply 50% discount
      totalPrice += (mintPrice * BigInt(discountedPacksToUse)) / BigInt(2);
      remainingAmount -= discountedPacksToUse;
    }

    // Handle remaining packs at full price
    if (remainingAmount > 0) {
      totalPrice += mintPrice * BigInt(remainingAmount);
    }

    return totalPrice;
  };

  const mint = async () => {
    try {
      const totalPrice = calculateMintPrice(mintAmount);

      await writeContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'mintPacks',
        args: [BigInt(mintAmount)],
        value: totalPrice,
        chain: pulsechain,
        account: address as `0x${string}`
      });
      
      toast({
        title: "Success!",
        description: `Successfully minted ${mintAmount} pack${mintAmount > 1 ? 's' : ''}!`,
      });
    } catch (error) {
      console.error('Minting error:', error);
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