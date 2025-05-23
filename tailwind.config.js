/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        "spin-once": "spin 0.5s linear 1",
      },
    },
  },
  plugins: [],
};