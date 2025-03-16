/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          bg: '#0A0A0A',
          card: '#121212',
          text: '#E1E1E1',
          muted: '#8A8A8A',
          accent: '#007AFF',
        },
        // Light theme colors
        light: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#1A1A1A',
          muted: '#6B7280',
          accent: '#007AFF',
        },
        primary: {
          DEFAULT: "#007AFF", // Apple's blue
          dark: "#0062CC",
          light: "#47A1FF",
        },
        secondary: {
          DEFAULT: "#1E293B",
          light: "#334155",
        },
        // Weather condition based colors
        clear: "#FFB900",
        partly: "#85C1E9",
        cloudy: "#9BA4B4",
        rain: "#3498DB",
        thunderstorm: "#566573",
        snow: "#D6EAF8",
        fog: "#D5DBDB",
        // Apple UI colors
        success: "#34C759",
        warning: "#FF9500",
        danger: "#FF3B30",
        info: "#5AC8FA",
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'apple-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'apple-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'apple-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'apple-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'apple-sm': '6px',
        'apple-md': '10px',
        'apple-lg': '14px',
        'apple-xl': '18px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'fade-in-left': 'fadeInLeft 0.8s ease-out',
        'fade-in-right': 'fadeInRight 0.8s ease-out',
        'scale-in': 'scaleIn 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'parallax-slow': 'parallax 20s ease infinite',
        'scroll-indicator': 'scrollIndicator 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        parallax: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0)' },
        },
        scrollIndicator: {
          '0%, 100%': { transform: 'translate(-50%, 0)' },
          '50%': { transform: 'translate(-50%, 10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px currentColor)' },
          '50%': { filter: 'drop-shadow(0 0 6px currentColor)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
        'bounce-out': 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      },
      dropShadow: {
        'glow-yellow': '0 0 4px rgba(250, 204, 21, 0.7)',
        'glow-blue': '0 0 4px rgba(59, 130, 246, 0.7)',
        'glow-white': '0 0 4px rgba(255, 255, 255, 0.7)',
        'glow-red': '0 0 4px rgba(239, 68, 68, 0.7)', 
        'glow-green': '0 0 4px rgba(34, 197, 94, 0.7)',
        'text': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'text-dark': '0 1px 2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}; 