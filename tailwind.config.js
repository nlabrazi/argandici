/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
    './nuxt.config.ts',
  ],
  safelist: [
    'bg-argan-gold',
    'hover:bg-argan-dark',
    'text-argan-gold',
    'text-argan-dark',
    'bg-argan-light',
    'text-argan-light',
    'hover:text-argan-dark',
    'focus:ring-argan-gold',
    'border-argan-light',
  ],
  theme: {
    extend: {
      colors: {
        'argan-gold': '#F4E1BB',
        'argan-rose': '#9F0502',
        'argan-eucalyptus': '#92A774',
        'argan-dark': '#8b5e3c',
        'argan-light': '#fff8f2',
        primary: '#8b5e3c',
        secondary: '#9F0502',
        accent: '#F4E1BB',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
