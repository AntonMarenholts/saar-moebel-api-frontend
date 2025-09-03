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
        "brand-blue": "#0057b7", // Синий цвет для акцентов
        "brand-yellow": "#ffd700", // Желтый цвет для акцентов
        "brand-light": "#f8f9fa", // Очень светло-серый для фона
        "brand-dark": "#343a40", // Темно-серый для текста
      },
    },
  },
  plugins: [],
};
