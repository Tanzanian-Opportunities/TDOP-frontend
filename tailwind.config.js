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
          primary: '#2563EB',
          secondary: '#0D9488',
          accent: '#F59E0B',
          navy: '#1E293B',
          light: '#F8FAFC',
          pastel: {
            jobs: '#EFF6FF',
            internships: '#FEF3C7',
            scholarships: '#D1FAE5',
            loans: '#EDE9FE',
            tenders: '#CCFBF1',
            events: '#FEF9C3',
            training: '#FCE7F3',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'Montserrat', 'Inter', 'sans-serif'],
        display: ['Montserrat', 'Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(37, 99, 235, 0.08)',
        'gold': '0 6px 20px rgba(245, 158, 11, 0.25)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)',
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
        'tdop-in': 'tdopIn 0.4s ease-out both',
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
        tdopIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
