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
        'elevated': '0 8px 30px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'bento': '0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(0, 0, 0, 0.02)',
        'bento-hover': '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.03)',
        'nav': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        'bento': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'marquee': 'marquee 30s linear infinite',
        'tdop-in': 'tdopIn 0.4s ease-out both',
        'story-in': 'storyIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'story-left': 'storySlideLeft 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'story-right': 'storySlideRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'progress-fill': 'progressFill 3500ms linear both',
        'dropdown-in': 'dropdownIn 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'skeleton': 'skeleton 1.8s ease-in-out infinite',
        'modal-in': 'modalIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        'toast-in': 'toastIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
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
        storyIn: {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        storySlideLeft: {
          '0%': { opacity: '0', transform: 'translateX(56px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        storySlideRight: {
          '0%': { opacity: '0', transform: 'translateX(-56px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        dropdownIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
