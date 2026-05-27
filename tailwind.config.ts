import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "1rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 45px -25px rgba(15, 23, 42, 0.55)",
        glass: "0 12px 40px rgba(15, 23, 42, 0.18)",
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.14), transparent 26%), radial-gradient(circle at 80% 0%, rgba(129, 140, 248, 0.16), transparent 28%), radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.12), transparent 24%)",
        "mesh-light":
          "radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.16), transparent 25%), radial-gradient(circle at 85% 10%, rgba(99, 102, 241, 0.12), transparent 24%), radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.1), transparent 22%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
