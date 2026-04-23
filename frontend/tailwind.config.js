/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#10B981', dark: '#059669', darker: '#047857' },
        gold: '#F59E0B',
      },
      fontFamily: { sans: ['Poppins', 'sans-serif'] },
    },
  },
  plugins: [],
}
