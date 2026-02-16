/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Rajdhani"', 'sans-serif'],
      },
      colors: {
        tech: {
          900: '#0a0a0b',
          800: '#121214',
          700: '#1c1c1f',
          500: '#71717a',
          300: '#a1a1aa',
        },
        primary: {
          500: '#e11d48', // Industrial Red/Crimson
          400: '#f43f5e',
          glow: 'rgba(244, 63, 94, 0.5)',
        },
        accent: {
          500: '#0ea5e9', // Cyber Blue
          400: '#38bdf8',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
        'dot-pattern': "radial-gradient(#27272a 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-md': '40px 40px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}

