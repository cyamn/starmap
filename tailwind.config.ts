import { DEFAULT } from "@react-three/fiber/dist/declarations/src/core/utils";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#060410",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(201, 65%, 88%)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(250, 60%, 40%)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        purple: {
          DEFAULT: "#8578c4",
          foreground: "hsl(var(--purple-foreground))",
        },
        info: {
          DEFAULT: "#52A7E0",
          foreground: "hsl(var(--info-foreground))",
        },
        success: {
          DEFAULT: "#70EE9C",
          foreground: "hsl(var(--info-foreground))",
        },
        warning: {
          DEFAULT: "#FFF07C",
          foreground: "hsl(var(--warning-foreground))",
        },
        danger: {
          DEFAULT: "#FC6DAB",
          foreground: "hsl(var(--danger-foreground))",
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
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      fontFamily: {
        prompt: ['"Prompt"'],
        promptBI: ['"PromptBI"'],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animated")],
};
