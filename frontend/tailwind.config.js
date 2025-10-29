/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        instagram: {
          blue: '#1877F2',
          pink: '#E91E63',
          purple: '#833AB4',
          orange: '#FD5949',
          yellow: '#FCCC63',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      utilities: {
        '.break-inside-avoid': {
          breakInside: 'avoid',
        },
        '.scrollbar-hide': {
          /* Hide scrollbar for Chrome, Safari and Opera */
          '-webkit-scrollbar': 'none',
          /* Hide scrollbar for IE, Edge and Firefox */
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};
