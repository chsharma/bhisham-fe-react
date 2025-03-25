/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',       // Blue
        secondary: '#1e40af',     // Dark Blue
        accent: '#dbeafe',        // Light Blue
        dark: '#1e293b',          // Dark Gray
        light: '#f8fafc',         // Light Gray
        success: '#22c55e',       // Green
        warning: '#f59e0b',       // Yellow
        danger: '#ef4444',        // Red
        info: '#3b82f6',          // Info Blue
        muted: '#64748b',         // Muted Gray
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.1)',
        medium: '0 6px 18px rgba(0, 0, 0, 0.15)',
        hard: '0 10px 24px rgba(0, 0, 0, 0.2)',
      },
      gradientColorStops: {
        'blue-gradient': ['#3b82f6', '#1e40af'],
        'green-gradient': ['#22c55e', '#16a34a'],
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        bounceSlow: 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
