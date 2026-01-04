/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: '#EBE9E4',
        ink: '#121212',
        red: {
          DEFAULT: '#d71e3d',
        },
        white: '#ffffff',
        // Keeping legacy mappings for compatibility if needed, but pointing to new vars where appropriate
        primary: {
          DEFAULT: '#121212', 
          light: '#2d2d2d',
          dark: '#000000',
          subtle: 'rgba(18, 18, 18, 0.05)',
        },
        accent: {
          DEFAULT: '#d71e3d',
          light: '#ff4b5c',
          dark: '#b3002d',
        },
        bg: {
          primary: '#EBE9E4',
          secondary: '#e1ded8', // darkened paper
          tertiary: '#d8d4cd',
          card: '#ffffff', // Solid white for cards
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          hover: 'rgba(0, 0, 0, 0.15)',
        },
        text: {
          primary: '#121212',
          secondary: '#3f3f46', // Zinc 700 - High contrast
          tertiary: '#52525b', // Zinc 600 - High contrast
          muted: '#71717a', // Zinc 500 - High contrast
        },
      },
      fontFamily: {
        title: ['var(--font-title)'],
        serif: ['var(--font-serif)'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.02)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
