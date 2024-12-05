import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createConfig, http, WagmiProvider } from 'wagmi';
import { pulsechain } from 'viem/chains';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import OpenPacks from "./pages/OpenPacks";

const projectId = import.meta.env.VITE_WALLET_CONNECT_ID;

if (!projectId) {
  throw new Error('WalletConnect project ID is required. Please set VITE_WALLET_CONNECT_ID in your .env file');
}

const config = getDefaultConfig({
  appName: 'Bulbasaur Card Minting',
  projectId,
  chains: [pulsechain],
  transports: {
    [pulsechain.id]: http(),
  },
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
              <Route path="/" element={<OpenPacks />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;