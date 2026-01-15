/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        'void-bg': '#1A1A1A',
        'void-card': '#272727',
        'void-border': '',
        'void-text': '#EBE5D9',
        'void-primary': '#D4C99E',
        'void-hover': '#FFFFFF',
        'void-accent': '#22946E',

        'corpus-bg': '#1A1A1A',
        'corpus-card': '#272727',
        'corpus-border': '',
        'corpus-text': '#EBE5D9',
        'corpus-primary': '#D4C99E',
        'corpus-hover': '#FFFFFF',
        'corpus-accent': '#22946E',

        'grineer-bg': '#1A1A1A',
        'grineer-card': '#272727',
        'grineer-border': '',
        'grineer-text': '#EBE5D9',
        'grineer-primary': '#D4C99E',
        'grineer-hover': '#FFFFFF',
        'grineer-accent': '#22946E',

        'orokin-bg': '#EEEEDA',
        'orokin-card': '#F8F8F0',
        'orokin-border': 'F4E7AC',
        'orokin-text': '#1F1F1F',
        'orokin-primary': '#F6D98D',
        'orokin-hover': '#F7CE65',
        'orokin-accent': '#2DC7DE',

        'classic-bg': '#FFFFFF',
        'classic-card': '#F1F1F1',
        'classic-border': '#D9D9D9',
        'classic-text': '#0C0916',
        'classic-primary': '#B30000',
        'classic-hover': '#800000',
        'classic-accent': '#DDC57D',

        'dark-bg': '#121212',
        'dark-card': '#282828',
        'dark-border': '#3F3F3F',
        'dark-text': '#A7A7A7',
        'dark-primary': '#8518E8',
        'dark-hover': '#A758EF',
        'dark-accent': '#22946E',
      }
    },
  },
  plugins: [],
}
