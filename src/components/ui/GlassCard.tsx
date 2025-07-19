import { Card } from "./card";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard = ({ className, children, ...props }: GlassCardProps) => {
  return (
    <Card
      className={cn(
        "cyber-glass neon-glow hologram-effect",
        "transition-all duration-300 hover:scale-[1.02]",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[hologram-sweep_3s_ease-in-out_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-neon-cyan/20 before:to-transparent",
        className
      )}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
};