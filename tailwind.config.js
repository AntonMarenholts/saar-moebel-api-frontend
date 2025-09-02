/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0057b7', // Синий цвет для акцентов
        'brand-yellow': '#ffd700', // Желтый цвет для акцентов
        'brand-light': '#f8f9fa', // Очень светло-серый для фона
        'brand-dark': '#343a40',  // Темно-серый для текста
      },
    },
  },
  plugins: [],
};