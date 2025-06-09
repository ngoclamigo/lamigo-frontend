import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dbe4ff",
          200: "#b6caff",
          300: "#8eaaff",
          400: "#6a90ff",
          500: "#4a74f1",
          600: "#3a5dd1",
          700: "#304db1",
          800: "#283e91",
          900: "#212f71",
          950: "#1a2255",
        },
      },
    },
  },
  plugins: [],
};
export default config;
