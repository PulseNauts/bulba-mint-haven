import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createConfig, http } from 'wagmi';
import { pulsechain } from 'viem/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import Index from "./pages/Index";
import OpenPacks from "./pages/OpenPacks";

const config = createConfig(
  getDefaultConfig({
    appName: 'Bulbasaur Cards',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // You'll need to get this from WalletConnect
    chains: [pulsechain],
    transports: {
      [pulsechain.id]: http()
    }
  })
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <RainbowKitProvider chains={[pulsechain]}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/open-packs" element={<OpenPacks />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  </QueryClientProvider>
);

export default App;