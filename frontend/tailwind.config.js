/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#FEF3D0',
          200: '#FDE69F',
          300: '#FBD26A',
          400: '#F9BF3B',
          500: '#F2B12D',   // Primary — exact logo amber-gold
          600: '#D4940F',   // Hover / darker
          700: '#A57A0A',   // Deep shadow tone from logo
          800: '#7A5A07',
        },
        dark: {
          900: '#000000',   // Pure black — logo background
          800: '#0A0A0A',   // Near-black for nav/footer
          700: '#111111',
          600: '#1A1A1A',
          500: '#252525',
          400: '#333333',
          300: '#444444',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Lato"', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'shimmer':  'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
