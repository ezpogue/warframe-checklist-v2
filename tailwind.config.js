/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
        colors: {
        'void-bg': '#192E2F',
        'void-card': '#333D3D',
        'void-border': '#47504F',
        'void-text': '#35C9AE',
        'void-primary': '#03A292',
        'void-hover': '#04635A',
        'void-accent': '#18927A',

        'corpus-bg': '#3A7EBA',
        'corpus-card': '#142B41',
        'corpus-border': '#2B95C5',
        'corpus-text': '#23C7F5',
        'corpus-primary': '#20A9D0',
        'corpus-hover': '#55B2DC',
        'corpus-accent': '#6FE5FD',

        'grineer-bg': '#261A07',
        'grineer-card': '#3F301E',
        'grineer-border': '#763C05',
        'grineer-text': '#99998F',
        'grineer-primary': '#770303',
        'grineer-hover': '#891D05',
        'grineer-accent': '#310401',

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
