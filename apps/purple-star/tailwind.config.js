const path = require("path");
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const { heroui } = require("@heroui/react");

// @heroui/theme の dist を hoisting 構成に依存せず解決
const heroUIContent = path.join(
  path.dirname(
    require.resolve("@heroui/theme", {
      paths: [path.dirname(require.resolve("@heroui/react"))]
    })
  ),
  "**/*.{js,ts,jsx,tsx}"
);

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    heroUIContent
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.neutral
      },
      fontFamily: {
        // to change, update font in _document.js
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-lora)", ...defaultTheme.fontFamily.serif],
        stock: [defaultTheme.fontFamily.sans],
        chart: ["游教科書体", "YuKyokasho"],
        // kaiti: ["adobe-kaiti-std", ...defaultTheme.fontFamily.sans],
        table: [
          "var(--font-noto)",
          "Hiragino Sans",
          "ヒラギノ角ゴシック"
        ],
        ship: ["var(--font-ship)"]
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/typography"), heroui()]
};
