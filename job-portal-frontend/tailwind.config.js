/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          500: '#1E88E5',
          600: '#1565C0',
          700: '#0D47A1',
          800: '#0A3A82',
        },
        ink: {
          DEFAULT: '#212121',
          muted: '#616161',
          secondary: '#455A64',
        },
        surface: {
          DEFAULT: '#F5F5F5',
          border: '#E0E0E0',
        },
        footer: {
          bg: '#263238',
          text: '#ECEFF1',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.12)',
        elevate: '0 8px 24px rgba(21, 101, 192, 0.12)',
      },
    },
  },
  plugins: [],
}
