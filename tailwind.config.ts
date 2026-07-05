import type { Config } from "tailwindcss";

// Design tokens for Loomora & Co.
// Palette named per brief: warm cream/beige base, near-black ink, antique (not shiny) gold accent.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F1E6", // primary background
        sand: "#ECE1CB", // secondary surface / section bg
        parchment: "#F1E9D8", // card surface
        ink: "#1C1712", // near-black text / footer bg
        charcoal: "#241E17",
        espresso: "#4A3626", // warm brown for secondary text
        gold: "#AD8347", // primary accent — antique gold, not shiny
        "gold-light": "#C9A876",
        "gold-dark": "#8A6535",
        line: "#DCCFAF", // hairline border color on cream
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        "8xl": "1440px",
      },
      keyframes: {
        weave: {
          "0%": { strokeDashoffset: "240" },
          "100%": { strokeDashoffset: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        weave: "weave 2.4s ease-out forwards",
        fadeUp: "fadeUp 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
