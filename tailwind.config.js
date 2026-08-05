/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.25rem',
      full: '9999px',
    },
    extend: {
      colors: {
        brand: {
          50: '#EEF4FF',
          100: '#D9E8FF',
          200: '#BCD6FF',
          300: '#8EBBFF',
          400: '#5896FF',
          500: '#0061FF',
          600: '#0050D1',
          700: '#0041A8',
          800: '#003580',
          900: '#002966',
        },
        surface: {
          DEFAULT: '#F4F7FE',
          card: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#1B2559',
          muted: '#A3AED0',
          soft: '#707EAE',
        },
        primary: {
          50: '#EEF4FF',
          100: '#D9E8FF',
          200: '#BCD6FF',
          300: '#8EBBFF',
          400: '#5896FF',
          500: '#0061FF',
          600: '#0050D1',
          700: '#0041A8',
          800: '#003580',
          900: '#002966',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
        soft: '0 10px 30px rgba(0, 61, 168, 0.08)',
      },
    },
  },
  plugins: [],
}
