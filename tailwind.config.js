/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      colors: {
        "brand-blue": "#0057b7", // Основной синий
        "brand-yellow": "#ffd700", // Акцентный желтый
        "brand-light": "#f8f9fa", // Светлый фон
        "brand-dark": "#343a40", // Темный текст
        // Цвета из темы "Events" для совместимости компонентов
        "cyan-400": "#22d3ee",
        "cyan-500": "#06b6d4",
        "cyan-600": "#0891b2",
        "cyan-700": "#0e7490",
        "gray-700": "#374151",
        "gray-800": "#1f2937",
      },
    },
  },
  plugins: [],
};