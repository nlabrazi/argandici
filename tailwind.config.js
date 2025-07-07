/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./app.vue",
    "./nuxt.config.ts"
  ],
  theme: {
    extend: {
      colors: {
        // Ajoute ici tes couleurs de marque
        'argan-gold': '#F4E1BB',
        'argan-rose': '#9F0502',
        'argan-eucalyptus': '#92A774',
        'argan-dark': '#8b5e3c',
        'argan-light': '#fff8f2',
        // Pour des classes utilitaires type "text-primary" etc.
        primary: '#8b5e3c',
        secondary: '#9F0502',
        accent: '#F4E1BB'
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        // Ajoute d'autres si besoin
      }
    }
  },
  plugins: [],
}
