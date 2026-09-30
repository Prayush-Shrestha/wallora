import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090C",
          900: "#0D0F14",
          850: "#13161D",
          800: "#181C25",
        },
        accent: {
          DEFAULT: "#E5A93C",
          ink: "#0D0903",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["system-ui", "-apple-system", "sans-serif"],
      },
      maxWidth: {
        shell: "1400px",
      },
    },
  },
  plugins: [],
};

export default config;
