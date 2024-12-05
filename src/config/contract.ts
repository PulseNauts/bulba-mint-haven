export const CONTRACT_CONFIG = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS as string,
  totalPacks: 222,
  cardsPerPack: 3,
  chain: {
    id: 369,
    name: "PulseChain",
    network: "pulsechain",
    nativeCurrency: {
      name: "Pulse",
      symbol: "PLS",
      decimals: 18
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.pulsechain.com"]
      },
      public: {
        http: ["https://rpc.pulsechain.com"]
      }
    },
    blockExplorers: {
      default: {
        name: "PulseScan",
        url: "https://scan.pulsechain.com"
      }
    }
  }
};