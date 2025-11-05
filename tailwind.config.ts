import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        reckless: ["Reckless", "sans-serif"],
        progBoldIta: ["Programme-BoldIta", "sans-serif"],
        progRegular: ["Programme-Regular", "sans-serif"],
        progLightIta: ["Programme-LightIta", "sans-serif"],
        progLight: ["Programme-Light", "sans-serif"],
        asapLight: ["InriaSans-Light", "sans-serif"],
      },
      colors: {
        title: "#F9F5F0",
        blue: "#3263CD"
      },
      fontSize: {
        xs: "22px",
        sm: "28px",
        md: "32px",
        lg: "44px",
        h5: "55px",
        h4: "68px",
        h3: "85px",
        h2: "107px",
        h1: "134px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};

export default config;
