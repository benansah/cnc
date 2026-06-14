import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Brand identity colors
        "brand-orange": "#FF6F00",
        "brand-orange-hover": "#F57C00",
        "brand-orange-light": "#FFE0B2",
        "brand-blue": "#425066",
        "brand-dark": "#616161",
        "brand-mid": "#CCCCCC",
        "brand-light": "#E6E6E6",
        "brand-peach": "#E6E6E6",
        // TF / Google-style UI system tokens
        "tf-bg2": "#F8F9FA",
        "tf-hover": "#F3F4F6",
        "tf-text": "#202124",
        "tf-body": "#5F6368",
        "tf-muted": "#80868B",
        "tf-border": "#E5E7EB",
        "tf-border-light": "#F1F3F4",
        "tf-blue": "#1A73E8",
        "tf-green": "#34A853",
        "tf-yellow": "#FBBC04",
        "tf-red": "#EA4335",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.12)",
        "orange-sm": "0 4px 16px rgba(255,111,0,0.20)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "fade-up": "fadeUp 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
