/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Corporate palette: white base, deep blue, teal/green, subtle gold.
        navy: {
          50: '#f2f6fa',
          100: '#e0eaf3',
          200: '#c2d5e6',
          300: '#93b4cf',
          400: '#5d8db3',
          500: '#3a6e97',
          600: '#28577d',
          700: '#204665',
          800: '#1b3a54',
          900: '#122a40',
          950: '#0a1727',
        },
        // Warm sand/cream panels to break up the plain white.
        cream: {
          50: '#faf6ec',
          100: '#f4edda',
          200: '#e9dcbe',
        },
        teal: {
          50: '#effaf7',
          100: '#d7f2ea',
          500: '#149e80',
          600: '#0d8069',
          700: '#0c6755',
        },
        gold: {
          50: '#fbf7ea',
          100: '#f5ecd0',
          200: '#eedfab',
          300: '#e4cd7d',
          400: '#d9b95c',
          500: '#c9a227',
          600: '#a5851f',
          700: '#7d6418',
        },
        ink: '#16283b',
      },
      boxShadow: {
        card: '0 8px 30px -12px rgba(18, 42, 64, 0.16)',
        soft: '0 2px 14px -6px rgba(18, 42, 64, 0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
