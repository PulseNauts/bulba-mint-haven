import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createConfig, http, WagmiProvider } from 'wagmi';
import { pulsechain } from 'viem/chains';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import Index from "./pages/Index";
import OpenPacks from "./pages/OpenPacks";

const projectId = import.meta.env.VITE_WALLET_CONNECT_ID;

const { wallets } = getDefaultWallets({
  appName: 'Bulbasaur Card Minting',
  projectId,
  chains: [pulsechain],
});

const config = createConfig({
  chains: [pulsechain],
  transports: {
    [pulsechain.id]: http(),
  },
  syncConnectedChain: true,
  ssr: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider 
        appInfo={{ 
          appName: 'Bulbasaur Card Minting',
          learnMoreUrl: 'https://bulbasaurpls.com',
        }}
        modalSize="compact" 
        coolMode
        initialChain={pulsechain}
      >
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
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;