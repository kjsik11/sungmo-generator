const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/frontend/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontWeight: {
        extraDark: 550,
      },
      fontFamily: {
        nanum: "'Nanum Gothic', sans-serif",
      },
      colors: {
        // You can add more colors here.
        sky: colors.sky,
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
