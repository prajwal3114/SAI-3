/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#f97316',
        accent: '#14b8a6',
      },
      boxShadow: {
        card: '0 10px 30px -15px rgba(15, 23, 42, 0.3)',
      },
    },
  },
  plugins: [],
};

