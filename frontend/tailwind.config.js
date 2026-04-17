/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Sora'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Cabinet Grotesk'", "'Sora'", "sans-serif"],
      },
      colors: {
        bg: {
          primary: "#080c14",
          secondary: "#0d1117",
          card: "#0f1620",
          glass: "rgba(15, 22, 32, 0.6)",
        },
        accent: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
        border: {
          subtle: "rgba(255,255,255,0.06)",
          medium: "rgba(255,255,255,0.1)",
          strong: "rgba(255,255,255,0.15)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-blue": "0 0 30px rgba(59, 130, 246, 0.3)",
        "glow-purple": "0 0 30px rgba(139, 92, 246, 0.3)",
        "glow-cyan": "0 0 30px rgba(6, 182, 212, 0.3)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 12px 48px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
