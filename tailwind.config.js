/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'f1-red': '#E10600',
        'f1-red-dark': '#C10500',
        'f1-red-light': '#FF1A1A',
        'f1-black': '#15151E',
        'f1-gray': '#38383F',
        'f1-silver': '#919194',
      },
      fontFamily: {
        f1: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
      backgroundImage: {
        checkered:
          'repeating-linear-gradient(45deg, #000 0, #000 20px, #fff 20px, #fff 40px)',
        'racing-stripe':
          'linear-gradient(90deg, transparent 0%, rgba(225, 6, 0, 0.1) 50%, transparent 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': {
            'box-shadow':
              '0 0 5px rgba(225, 6, 0, 0.5), 0 0 10px rgba(225, 6, 0, 0.3)',
          },
          '100%': {
            'box-shadow':
              '0 0 20px rgba(225, 6, 0, 0.8), 0 0 30px rgba(225, 6, 0, 0.5)',
          },
        },
      },
    },
  },
  plugins: [],
};
