import { motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Animated background effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-cyber-surface to-cyber-darker" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-60 animate-pulse" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative container mx-auto px-4 py-8 space-y-8"
      >
        {children}
      </motion.div>
    </div>
  );
};