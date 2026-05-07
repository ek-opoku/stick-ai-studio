import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "../shared/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        panel: "#f7f3ec",
        line: "#d7d0c4",
        action: "#2563eb",
        moss: "#4f6f52"
      }
    }
  },
  plugins: []
};

export default config;
