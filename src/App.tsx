import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Config, createConfig, http } from 'wagmi';
import { pulsechain } from 'viem/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import Index from "./pages/Index";
import OpenPacks from "./pages/OpenPacks";

const config = createConfig(
  getDefaultConfig({
    appName: 'Bulbasaur Cards',
    projectId: import.meta.env.VITE_WALLET_CONNECT_ID,
    chains: [pulsechain],
    transports: {
      [pulsechain.id]: http()
    }
  }) as Config
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
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
);

export default App;