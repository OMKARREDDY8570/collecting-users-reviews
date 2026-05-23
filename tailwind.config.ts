import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        success: "#16a34a",
        danger: "#dc2626",
        warning: "#f59e0b",
      },
    },
  },
  plugins: [],
};
export default config;
