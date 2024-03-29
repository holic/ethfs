import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      aria: {
        label: "label",
      },
      boxShadow: {
        hard: "0.5rem 0.5rem 0 0 rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
