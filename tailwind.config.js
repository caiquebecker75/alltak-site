/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Official Alltak brand palette (Guide 2025): black, blue, navy, cream.
        alltak: {
          black: '#000000',
          ink: '#0a0d12',
          coal: '#12161c',
          // Azul — Pantone 2382C
          blue: '#0080ff',
          blueDark: '#0055aa',
          blueDeep: '#002b55',
          blueLight: '#55aaff',
          blueMist: '#aad5ff',
          // Azul-marinho — Pantone 281C
          navy: '#00205b',
          navy2: '#00153d',
          navyDeep: '#000b1e',
          navyMuted: '#556a92',
          // Creme — Pantone 9064C
          cream: '#f1f1de',
          cream2: '#fafaf4',
          creamShade: '#a1a194',
          steel: '#8f9399',
        },
      },
      fontFamily: {
        // Archivo — heavy geometric grotesque, close to the brand's bold titles.
        display: ['"Archivo Expanded"', 'Archivo', 'Arial', 'sans-serif'],
        sans: ['Archivo', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: { content: '1240px' },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'marquee-rev': { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shine: { '0%': { transform: 'translateX(-120%)' }, '100%': { transform: 'translateX(220%)' } },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        'marquee-rev': 'marquee-rev 26s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
