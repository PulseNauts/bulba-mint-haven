import { useAccount, useConnect, useChainId, useSwitchChain, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useToast } from "@/components/ui/use-toast";
import { CONTRACT_CONFIG } from "@/config/contract";
import { Link } from "react-router-dom";
import { MintControls } from "@/components/MintControls";
import { motion } from "framer-motion";
import { CollectionStats } from "@/components/CollectionStats";
import { PageContainer } from "@/components/ui/PageContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Info } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      if (chainId !== CONTRACT_CONFIG.chain.id) {
        await switchChain({ chainId: CONTRACT_CONFIG.chain.id });
      }
      await connect({
        connector: injected(),
        chainId: CONTRACT_CONFIG.chain.id,
      });
    } catch (error: any) {
      if (error?.code === -32002) {
        toast({
          variant: "destructive",
          title: "Connection Pending",
          description: "Please check your wallet for pending connection requests.",
        });
      } else if (error?.code === 4001) {
        return;
      } else if (error?.message?.includes("no injected wallets")) {
        toast({
          variant: "destructive",
          title: "No Wallet Found",
          description: "Please install a Web3 wallet like MetaMask to continue.",
        });
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disconnect wallet.",
      });
    }
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-custom-primary to-custom-accent bg-clip-text text-transparent">
          Bulbasaur Cards
        </h1>
        {isConnected && (
          <Button variant="outline" onClick={handleDisconnect} className="glass-effect z-10">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-custom-light">Mint Your Packs</h2>
            <p className="text-lg text-custom-light/80">
              Join the Bulbasaur Cards community on PulseChain. Each pack contains unique cards with varying rarity.
            </p>
          </div>

          <CollectionStats />

          <GlassCard className="p-6">
            <div className="mb-4 p-4 rounded-lg bg-custom-primary/10 border border-custom-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-custom-primary" />
                <h3 className="font-semibold text-custom-light">Pack Details</h3>
              </div>
              <ul className="space-y-2 text-custom-light/80">
                <li>• {CONTRACT_CONFIG.cardsPerPack} cards per pack</li>
                <li>• Mint Price: {Number(CONTRACT_CONFIG.mintPrice) / 1e18} PLS</li>
                <li>• Maximum supply: {CONTRACT_CONFIG.totalPacks} packs</li>
              </ul>
            </div>

            <MintControls />

            {isConnected && (
              <Link to="/open-packs" className="block mt-4 z-10 relative">
                <Button className="w-full glass-effect" variant="outline">
                  <Package className="mr-2 h-5 w-5" />
                  Go to My Profile
                </Button>
              </Link>
            )}
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <div className="aspect-square relative pack-glow animate-float">
            <img
              src="/lovable-uploads/d088a9e7-5cd7-41fe-b056-00dbec2fd5be.png"
              alt="Pokechain Pack"
              className="w-full h-full object-contain rounded-2xl card-hover"
            />
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default Index;
