/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: '#78b82a',
        moss: '#4d7c0f',
        surface: '#fbfdf7'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 118, 110, 0.12)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
