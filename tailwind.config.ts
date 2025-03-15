const { heroui } = require("@heroui/react");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  darkMode: ["class"],
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              // blue-700
              DEFAULT: "#1d4ed8",
              foreground: "#FFFFFF",
            },
            secondary: {
              // violet-700
              DEFAULT: "#6d28d9",
              foreground: "#FFFFFF",
            },
            focus: "#1d4ed8",
          },
        },
      },
    }),
    require("@tailwindcss/typography"),
  ],
};
