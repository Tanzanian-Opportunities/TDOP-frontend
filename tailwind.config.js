/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tdop: {
          primary: '#003366',
          secondary: '#0047AB',
          accent: '#FFC107',
          royal: '#003366',
          royalLight: '#0047AB',
          gold: '#FFC107',
          goldDark: '#E0A800',
          cyan: '#06B6D4',
          teal: '#0D9488',
          navy: '#00112A',
          success: '#16A34A',
          danger: '#DC2626',
          warning: '#FFC107',
          dark: '#0F172A',
          light: '#F8F9FA',
          pastel: {
            jobs: '#E3F2FD',
            internships: '#FFF3E0',
            scholarships: '#E8F5E9',
            loans: '#F3E5F5',
            tenders: '#E0F7FA',
            events: '#FFF8E1',
            training: '#FDE8EC',
          },
          gray: {
            50: '#F8F9FA',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'Montserrat', 'Inter', 'sans-serif'],
        display: ['Montserrat', 'Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(0, 51, 102, 0.08)',
        'navy': '0 10px 40px rgba(0, 17, 42, 0.5)',
        'gold': '0 6px 20px rgba(255, 193, 7, 0.35)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};