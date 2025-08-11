import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      extend: "light",
      colors: {
        background: "#FFFFFF",
        foreground: "#000000",
        primary: {
          foreground: "#000000",
          DEFAULT: "#22C55E", // Green
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        secondary: {
          foreground: "#FFFFFF",
          DEFAULT: "#EC4899", // Pink
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843",
        },
      },
    },
    dark: {
      extend: "dark",
      colors: {
        background: "#1a1a1a",
        foreground: "#f0f0f0",
        primary: {
          foreground: "#000000",
          DEFAULT: "#22C55E", // Green
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        secondary: {
          foreground: "#FFFFFF",
          DEFAULT: "#EC4899", // Pink
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843",
        },
      },
    },
  },
});
