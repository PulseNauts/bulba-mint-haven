import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { useToast } from "@/components/ui/use-toast";
import { pulsechain } from 'viem/chains';

export const usePackOperations = () => {
  const { toast } = useToast();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({ hash });
  const { address } = useAccount();

  const openPacks = async (packIds: number[]) => {
    try {
      await writeContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'openPacks',
        args: [packIds.map(id => BigInt(id))],
        chain: pulsechain,
        account: address,
      });

      toast({
        title: "Opening packs...",
        description: `Opening ${packIds.length} pack(s)! Please wait for the transaction to be confirmed.`,
      });

      // Check if window exists and has triggerCardRescan
      if (typeof window !== 'undefined' && (window as any).triggerCardRescan) {
        // Wait a few seconds after confirmation to allow for indexing
        setTimeout(() => {
          (window as any).triggerCardRescan();
        }, 5000); // Wait 5 seconds after confirmation
      }

      return true;
    } catch (error) {
      console.error('Error opening packs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to open packs. Please try again.",
      });
      return false;
    }
  };

  return {
    openPacks,
    isOpening: isPending || isWaiting
  };
};