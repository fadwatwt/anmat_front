/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F4F9FF",
          100: "var(--color-blue-ebf1ff)",
          150: "#CDD0D5",
          200: "var(--color-blue-c2d6ff)",
          300: "#ADC8FF",
          400: "#84A9FF",
          500: "var(--color-primary)",
          600: "#2E4CDB",
          700: "#253EA7",
          800: "#1B2B91",
          900: "#101A66",
          lighter: "var(--color-blue-ebf1ff)",
          base: "var(--color-primary)",
        },
        gray: {
          800: "var(--bg-surface)",
          900: "var(--bg-main)",
        },
        soft: {
          200: "var(--menu-icon)",
          400: "#757C8A",
          500: "#31353F",
        },
        green: {
          success: "var(--color-success)",
        },
        red: {
          error: "var(--color-error)",
        },
        sub: {
          300: "#CDD0D5",
          500: "var(--text-secondary)",
        },
        white: {
          DEFAULT: "#fff",
          0: "var(--bg-surface)",
        },
        veryWeak: {
          50: "#FBFCFD",
          500: "#31353F",
        },
        main: {
          900: "var(--bg-main)",
          100: "#0A0D14",
        },
        black: {
          DEFAULT: "#000",
        },
        weak: {
          100: "var(--color-f6f8fa)",
          800: "var(--bg-main)",
        },
        "ui-gray": "var(--bg-main)",
        main: "var(--bg-main)",
        surface: "var(--bg-surface)",
        "menu-icon": "var(--menu-icon)",
        "menu-active-text": "var(--menu-active-text)",
        "menu-active-bg": "var(--menu-active-bg)",
        "badge-bg": "var(--badge-bg)",
      },
      fontFamily: {
        ar: ['"Almarai"', "sans-serif"],
        default: ['"Roboto"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
