import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF8F4",
          100: "#F6F3EC", // 主背景
          200: "#ECE7DA",
          300: "#DFD8C4",
          400: "#CDC4AB",
        },
        charcoal: {
          900: "#1A1A1A",
          800: "#222222", // 主文字
          600: "#555555",
          400: "#888888",
          200: "#CCCCCC",
          100: "#E5E5E5",
        },
        insight: {
          DEFAULT: "#7656E8", // 强调紫
          hover: "#6444D5",
          light: "#F0ECFC",
          muted: "#E0D7F9",
        },
        sage: {
          DEFAULT: "#DCE6D9", // 鼠尾草绿
          light: "#EEF3EC",
          dark: "#ADC0A7",
          deep: "#546850",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Noto Sans SC"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(34, 34, 34, 0.06)",
        card: "0 8px 30px rgba(0, 0, 0, 0.08)",
        floating: "0 16px 40px rgba(118, 86, 232, 0.12)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
export default config;
