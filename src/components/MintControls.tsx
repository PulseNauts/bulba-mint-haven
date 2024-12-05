import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { pulsechain } from 'viem/chains';
import { useToast } from "@/components/ui/use-toast";
import { BenefitsDisplay } from "./mint/BenefitsDisplay";
import { MintAmountControls } from "./mint/MintAmountControls";
import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface MintControlsProps {
  mintAmount: number;
  setMintAmount: (amount: number) => void;
  isConnected: boolean;
  isMinting: boolean;
  onMint: (price: bigint) => void;
  maxMintAmount: number;
}

export const MintControls = ({
  mintAmount,
  setMintAmount,
  isConnected,
  isMinting,
  onMint,
  maxMintAmount,
}: MintControlsProps) => {
  const { address } = useAccount();
  const { toast } = useToast();

  const { data: mintPrice } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'mintPrice',
    chainId: pulsechain.id,
  });

  const { data: isWhale, isSuccess: whaleCheckSuccess } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isWhaleHolder',
    args: [address as `0x${string}`],
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address,
    }
  });

  const { data: isHolder, isSuccess: holderCheckSuccess } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isBulbaHolder',
    args: [address as `0x${string}`],
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address,
    }
  });

  const { data: hasClaimedFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'hasFreePack',
    args: [address as `0x${string}`],
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address && Boolean(isWhale),
    }
  });

  const { data: discountedPacksMinted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'discountedPacksMintedByUser',
    args: [address as `0x${string}`],
    chainId: pulsechain.id,
    query: {
      enabled: isConnected && !!address && (Boolean(isWhale) || Boolean(isHolder)),
    }
  });

  const calculateMintPrice = () => {
    if (!mintPrice) return BigInt(0);
    
    let totalPrice = BigInt(0);
    let remainingPacks = mintAmount;

    // Handle free pack for whales
    if (isWhale && !hasClaimedFreePack && remainingPacks > 0) {
      remainingPacks--;
    }

    // Handle discounted packs for whales and holders
    if ((isWhale || isHolder) && remainingPacks > 0) {
      const remainingDiscountedPacks = 5 - Number(discountedPacksMinted || 0);
      const discountedPacksToUse = Math.min(remainingDiscountedPacks, remainingPacks);
      
      if (discountedPacksToUse > 0) {
        totalPrice += (mintPrice / BigInt(2)) * BigInt(discountedPacksToUse);
        remainingPacks -= discountedPacksToUse;
      }
    }

    // Add full price packs
    if (remainingPacks > 0) {
      totalPrice += mintPrice * BigInt(remainingPacks);
    }

    return totalPrice;
  };

  const handleMint = () => {
    const price = calculateMintPrice();
    onMint(price);
  };

  const getMintButtonText = () => {
    if (!whaleCheckSuccess || !holderCheckSuccess) return 'Checking Status...';

    const packText = mintAmount > 1 ? 'Packs' : 'Pack';
    if (isWhale && !hasClaimedFreePack) {
      return `Mint ${mintAmount} ${packText} (First Pack Free!)`;
    }
    return `Mint ${mintAmount} ${packText}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
          Mint Complete
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for participating in our mint! You can now view your packs in your profile.
        </p>
        <Link to="/open-packs" className="block">
          <Button className="w-full" variant="default">
            <Package className="mr-2 h-4 w-4" />
            Go to My Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};
