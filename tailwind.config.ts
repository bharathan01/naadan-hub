import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D5F3F',
        accent: '#F4A460',
        cream: '#F8F5F0',
        beige: '#FAF8F5',
        lightBeige: '#F5EFE7',
        darkGreen: '#1B3A2F',
        olive: '#556B2F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;