/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#00E5FF",
          purple: "#A855F7",
          green: "#00FF9D",
          pink: "#FF3366",
          yellow: "#FFE600",
        },
        dark: {
          DEFAULT: "#050816",
          lighter: "#0A0F24",
          card: "rgba(255,255,255,0.08)",
        },
        border: "rgba(255,255,255,0.12)",
        text: {
          DEFAULT: "#FFFFFF",
          muted: "#D1D5DB",
          dim: "#8B93A7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2.5s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delay": "float 6s ease-in-out 2s infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "border-glow": "border-glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 12s linear infinite",
        "bounce-glow": "bounce-glow 1.4s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6", filter: "blur(8px)" },
          "50%": { opacity: "1", filter: "blur(4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "border-glow": {
          "0%": { boxShadow: "0 0 6px rgba(0,229,255,0.3)" },
          "100%": { boxShadow: "0 0 18px rgba(0,229,255,0.7)" },
        },
        "bounce-glow": {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 8px rgba(0,229,255,0.4)" },
          "50%": { transform: "scale(1.04)", boxShadow: "0 0 22px rgba(0,229,255,0.9)" },
        },
      },
    },
  },
  plugins: [],
};
