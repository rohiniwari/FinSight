/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#05060f',
          800: '#0a0c1a',
          700: '#0f1224',
          600: '#181b2e',
        },
      },
      animation: {
        'ping-slow': 'ping 1.5s cubic-bezier(0,0,.2,1) infinite',
        'orb1':      'orb1 14s ease-in-out infinite',
        'orb2':      'orb2 11s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
