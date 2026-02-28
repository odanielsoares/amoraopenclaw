import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mc: {
          bg: "#0a0e17",
          surface: "#111827",
          panel: "#151d2e",
          border: "#1e293b",
          accent: "#3b82f6",
          glow: "#60a5fa",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          muted: "#64748b",
          text: "#e2e8f0",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(59, 130, 246, 0.15)",
        "glow-success": "0 0 20px rgba(34, 197, 94, 0.15)",
        "glow-error": "0 0 20px rgba(239, 68, 68, 0.15)",
        "glow-warning": "0 0 20px rgba(245, 158, 11, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanLine 4s linear infinite",
      },
      keyframes: {
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
