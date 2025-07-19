import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neon: {
          pink: 'hsl(var(--neon-pink))',
          cyan: 'hsl(var(--neon-cyan))',
          yellow: 'hsl(var(--neon-yellow))',
          green: 'hsl(var(--neon-green))',
          purple: 'hsl(var(--neon-purple))',
        },
        cyber: {
          surface: 'hsl(var(--dark-surface))',
          darker: 'hsl(var(--darker-surface))',
          glow: 'hsl(var(--glow-intense))',
          glowSoft: 'hsl(var(--glow-soft))',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "cyber-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 5px hsl(var(--neon-pink)), 0 0 10px hsl(var(--neon-pink))" 
          },
          "50%": { 
            boxShadow: "0 0 10px hsl(var(--neon-pink)), 0 0 20px hsl(var(--neon-pink)), 0 0 30px hsl(var(--neon-pink))" 
          },
        },
        "data-stream": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        "neon-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
          "75%": { opacity: "0.9" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "cyber-glow": "cyber-glow 2s ease-in-out infinite",
        "data-stream": "data-stream 3s linear infinite",
        "neon-flicker": "neon-flicker 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;