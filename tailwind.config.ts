import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0D0D0D",
          900: "#151515",
          800: "#1B1B1B",
          700: "#262626",
          600: "#404040",
        },
        paper: "#F5F5F5",
        muted: "#A3A3A3",
        accent: {
          DEFAULT: "#D8FF3E",
          dim: "#B8D936",
          ink: "#1A1D05",
        },
        clay: "#E4572E",
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "DM Sans", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        shell: "1320px",
      },
    },
  },
  plugins: [
    function ({ addVariant }: any) {
      addVariant("light", ".light &");
    },
  ],
};
export default config;
