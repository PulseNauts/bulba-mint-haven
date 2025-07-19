import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "cyber-button",
        destructive:
          "bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground hover:shadow-lg hover:shadow-destructive/25 hover:-translate-y-0.5",
        outline:
          "cyber-button-secondary",
        secondary:
          "bg-gradient-to-r from-secondary to-neon-cyan text-secondary-foreground hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5",
        ghost: "hover:bg-muted/20 hover:text-neon-cyan transition-all duration-300",
        link: "text-neon-pink underline-offset-4 hover:underline hover:text-neon-purple transition-colors",
        cyber: "bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan text-foreground font-bold shadow-lg shadow-neon-pink/25 hover:shadow-xl hover:shadow-neon-pink/40 hover:-translate-y-1 animate-neon-flicker",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-14 rounded-lg px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
