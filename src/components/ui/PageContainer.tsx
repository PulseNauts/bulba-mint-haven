import { motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`min-h-screen bg-custom-dark ${className}`}>
      <div className="fixed inset-0 bg-gradient-radial from-custom-primary/5 via-transparent to-transparent" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative container mx-auto px-4 py-8 space-y-8"
      >
        {children}
      </motion.div>
    </div>
  );
};