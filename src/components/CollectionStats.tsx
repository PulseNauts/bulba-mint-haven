import { motion } from "framer-motion";
import { useContractData } from "@/hooks/useContractData";
import { Card } from "./ui/card";
import { Package, Flame, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { createPublicClient, http, parseAbiItem } from "viem";
import { pulsechain } from "viem/chains";
import { CONTRACT_CONFIG } from "@/config/contract";

export const CollectionStats = () => {
  const { totalMinted, totalPacks, mintPrice } = useContractData();
  const [burnedPacks, setBurnedPacks] = useState(0);
  
  useEffect(() => {
    const fetchBurnedPacks = async () => {
      const client = createPublicClient({
        chain: pulsechain,
        transport: http()
      });

      // Get all transfer events where tokens were burned (sent to zero address)
      const burnEvents = await client.getLogs({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        event: parseAbiItem('event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)'),
        fromBlock: 0n,
        toBlock: 'latest'
      });

      // Count unique token IDs that were burned (transferred to zero address)
      const burnedTokens = burnEvents.filter(event => 
        event.args.to === '0x0000000000000000000000000000000000000000' &&
        event.args.id >= 1n && event.args.id <= 222n // Only count pack tokens (1-222)
      );

      setBurnedPacks(burnedTokens.length);
    };

    fetchBurnedPacks();
  }, []);
  
  const stats = [
    {
      label: "Total Supply",
      value: totalPacks?.toString() || "222",
      icon: Database,
      delay: 0,
    },
    {
      label: "Minted",
      value: "222/222", // Hardcoded since all packs are minted
      icon: Package,
      delay: 0.1,
    },
    {
      label: "Burned Packs",
      value: burnedPacks.toString(),
      icon: Flame,
      delay: 0.2,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay, duration: 0.5 }}
        >
          <Card className="p-4 bg-white/5 backdrop-blur border-none">
            <div className="flex items-center gap-3">
              <stat.icon className="h-5 w-5 text-custom-primary" />
              <div>
                <p className="text-sm text-custom-light/70">{stat.label}</p>
                <p className="text-xl font-bold text-custom-light">{stat.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};