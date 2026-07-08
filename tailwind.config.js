/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — Alltak
        alltak: {
          red: '#e30613',      // assinatura / logo
          black: '#0a0a0a',
          ink: '#111214',
          navy: '#0b1c33',     // azul escuro (DECOR / SIGNS)
          navy2: '#0f2748',
          blue: '#0a7cff',     // azul de destaque
          steel: '#8f9399',
          mist: '#f4f5f6',
        },
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Arial Narrow', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease both',
      },
    },
  },
  plugins: [],
}
