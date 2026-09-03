/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F4EE',
        paper2: '#EFE8DC',
        ink: '#1A1714',
        inksoft: '#5A534A',
        copper: '#B08A4F',
        copperhot: '#8E6A32',
        hold: '#C45C26',
        confirmed: '#2F5A40',
      },
      fontFamily: {
        display: ['Newsreader', 'Source Serif 4', 'Georgia', 'serif'],
        sans: ['Schibsted Grotesk', 'Geist', 'system-ui', 'sans-serif'],
      },
      borderRadius: { ctl: '4px', sheet: '28px' },
      transitionTimingFunction: { desk: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
    },
  },
  plugins: [],
}
