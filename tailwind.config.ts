import type { Config } from "tailwindcss";
import { brand } from "./lib/brand";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.ts",
  ],
  theme: {
    extend: {
      colors: {
        primary: brand.colors.primary,
        accent: brand.colors.accent,
        background: brand.colors.background,
        foreground: brand.colors.foreground,
        muted: brand.colors.muted,
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: [
          "var(--font-body)",
          "Helvetica",
          '"Helvetica Neue"',
          "Arial",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
