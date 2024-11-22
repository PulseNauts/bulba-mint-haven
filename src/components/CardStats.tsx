import { Card } from "./ui/card";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

interface CardStatsProps {
  totalCards: number;
  loadingCards: boolean;
}

export const CardStats = ({ totalCards, loadingCards }: CardStatsProps) => {
  const { address } = useAccount();

  const stats = [
    {
      title: "Total Collection",
      value: "666",
      description: "Unique Cards"
    },
    {
      title: "Your Cards",
      value: totalCards.toString(),
      description: loadingCards ? "Scanning..." : "Found Cards"
    },
    {
      title: "Completion",
      value: `${((totalCards / 666) * 100).toFixed(1)}%`,
      description: "Collection Complete"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-custom-lightGreen/80 to-custom-mediumGreen/80 backdrop-blur border-none shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-custom-darkGreen mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-custom-darkGreen mb-1">{stat.value}</p>
              <p className="text-sm text-custom-darkGreen/80">{stat.description}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};