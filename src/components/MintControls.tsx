import { Button } from "@/components/ui/button";
import { Loader2, Crown, Fish } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/contract';
import { CONTRACT_ABI } from '@/config/abi';
import { pulsechain } from 'viem/chains';
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_CONFIG } from "@/config/contract";
import { CONTRACT_ABI } from "@/config/abi";
import { pulsechain } from "viem/chains";
import { useToast } from "@/components/ui/use-toast";

export type HolderTier = 'whale' | 'holder' | 'public';
export type HolderTier = "whale" | "holder" | "public";

interface MintControlsProps {
  mintAmount: number;
@@ -36,7 +36,7 @@ export const MintControls = ({
  const { data: isWhale, isLoading: isLoadingWhale, refetch: refetchWhale } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isWhaleHolder',
    functionName: "isWhaleHolder",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
@@ -45,7 +45,7 @@ export const MintControls = ({
  const { data: isHolder, isLoading: isLoadingHolder, refetch: refetchHolder } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isBulbaHolder',
    functionName: "isBulbaHolder",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address,
@@ -54,7 +54,7 @@ export const MintControls = ({
  const { data: hasClaimedFreePack, refetch: refetchFreePack } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'hasFreePack',
    functionName: "hasFreePack",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && Boolean(isWhale),
@@ -63,51 +63,46 @@ export const MintControls = ({
  const { data: discountedPacksMinted, refetch: refetchDiscounted } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'discountedPacksMintedByUser',
    functionName: "discountedPacksMintedByUser",
    args: address ? [address as `0x${string}`] : undefined,
    chainId: pulsechain.id,
    enabled: isConnected && !!address && (Boolean(isWhale) || Boolean(isHolder)),
  });

  let tier: HolderTier = 'public';
  let tier: HolderTier = "public";
  let maxFreePacks = 0;
  let maxDiscountedPacks = 0;

  if (isWhale) {
    console.log('Whale status detected');
    tier = 'whale';
    console.log("Whale status detected");
    tier = "whale";
    maxFreePacks = hasClaimedFreePack ? 0 : 1;
    maxDiscountedPacks = 5 - (Number(discountedPacksMinted) || 0);
    console.log(`Whale benefits: ${maxFreePacks} free packs, ${maxDiscountedPacks} discounted packs remaining`);
  } else if (isHolder) {
    console.log('Holder status detected');
    tier = 'holder';
    console.log("Holder status detected");
    tier = "holder";
    maxFreePacks = 0;
    maxDiscountedPacks = 5 - (Number(discountedPacksMinted) || 0);
    console.log(`Holder benefits: ${maxDiscountedPacks} discounted packs remaining`);
  } else {
    console.log('Public tier detected - no special benefits');
    console.log("Public tier detected - no special benefits");
  }

  const freePacks = Math.max(0, maxFreePacks);
  const discountedPacks = Math.max(0, maxDiscountedPacks);

  const checkEligibility = async () => {
    console.log('Refreshing eligibility status...');
    console.log("Refreshing eligibility status...");
    try {
      await Promise.all([
        refetchWhale(),
        refetchHolder(),
        refetchFreePack(),
        refetchDiscounted()
      ]);
      console.log('Eligibility status refreshed successfully');
      await Promise.all([refetchWhale(), refetchHolder(), refetchFreePack(), refetchDiscounted()]);
      console.log("Eligibility status refreshed successfully");
      toast({
        title: "Status Updated",
        description: `Current tier: ${tier.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error refreshing eligibility:', error);
      console.error("Error refreshing eligibility:", error);
      toast({
        variant: "destructive",
        title: "Error",
@@ -116,16 +111,16 @@ export const MintControls = ({
    }
  };

  console.log('Rendering MintControls with:', { tier, freePacks, discountedPacks, mintAmount });
  console.log("Rendering MintControls with:", { tier, freePacks, discountedPacks, mintAmount });

  const getBenefitsDisplay = () => {
    if (!tier) {
      console.log('No tier detected, skipping benefits display');
      console.log("No tier detected, skipping benefits display");
      return null;
    }

    if (tier === 'whale') {
      console.log('Displaying whale benefits:', { freePacks, discountedPacks });
    if (tier === "whale") {
      console.log("Displaying whale benefits:", { freePacks, discountedPacks });
      return (
        <Alert className="bg-purple-500/10 border-purple-500/20">
          <Crown className="h-5 w-5 text-purple-500" />
@@ -138,8 +133,8 @@ export const MintControls = ({
      );
    }

    if (tier === 'holder') {
      console.log('Displaying holder benefits:', { discountedPacks });
    if (tier === "holder") {
      console.log("Displaying holder benefits:", { discountedPacks });
      return (
        <Alert className="bg-cyan-500/10 border-cyan-500/20">
          <Fish className="h-5 w-5 text-cyan-500" />
@@ -151,19 +146,19 @@ export const MintControls = ({
      );
    }

    console.log('No special benefits to display');
    console.log("No special benefits to display");
    return null;
  };

  const getMintButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (!isConnected) return "Connect Wallet";

    const packText = mintAmount > 1 ? 'Packs' : 'Pack';
    if (tier === 'whale' && mintAmount <= freePacks) {
      console.log('Displaying free mint button text');
    const packText = mintAmount > 1 ? "Packs" : "Pack";
    if (tier === "whale" && mintAmount <= freePacks) {
      console.log("Displaying free mint button text");
      return `Mint ${mintAmount} FREE ${packText}`;
    }
    console.log('Displaying standard mint button text');
    console.log("Displaying standard mint button text");
    return `Mint ${mintAmount} ${packText}`;
  };

@@ -189,11 +184,7 @@ export const MintControls = ({
        </Button>
      </div>

      <Button
        onClick={isConnected ? onMint : onConnect}
        disabled={isMinting}
        className="w-full"
      >
      <Button onClick={isConnected ? onMint : onConnect} disabled={isMinting} className="w-full">
        {isMinting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
@@ -204,19 +195,6 @@ export const MintControls = ({
        )}
      </Button>

      <Button
        onClick={() => {
          toast({
            title: "Test Button Clicked",
            description: "This confirms that Lovable's backend is properly handling code updates.",
          });
        }}
        className="w-full"
        variant="secondary"
      >
        Test Button
      </Button>
      {isConnected && (
        <div className="space-y-4">
          <Button className="w-full" variant="outline">
@@ -232,4 +210,4 @@ export const MintControls = ({
      )}
    </div>
  );
};
};
