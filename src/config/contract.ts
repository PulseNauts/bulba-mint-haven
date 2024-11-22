export const CONTRACT_CONFIG = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS as string,
  mintPrice: "90000000000000000000000", // 90,000 PLS
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
        http: ["https://rpc-pulsechain.g4mm4.io"]
      },
      public: {
        http: ["https://rpc-pulsechain.g4mm4.io"]
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