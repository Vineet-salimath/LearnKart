/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Premium indigo-blue gradient system
        primary: '#6366f1', // Indigo
        'primary-dark': '#4f46e5', // Darker indigo
        secondary: '#3b82f6', // Blue
        'secondary-dark': '#2563eb', // Darker blue
        accent: '#8b5cf6', // Purple accent
        'accent-dark': '#7c3aed',
        success: '#10b981', // Emerald
        warning: '#f59e0b', // Amber
        error: '#ef4444', // Red

        // Neutral palette
        background: '#ffffff', // Pure white background
        'background-secondary': '#f8fafc', // Slate 50
        'background-tertiary': '#f1f5f9', // Slate 100
        surface: '#ffffff',
        border: '#e2e8f0', // Slate 200

        // Text hierarchy
        text: '#0f172a', // Slate 900
        'text-secondary': '#334155', // Slate 700
        'text-tertiary': '#64748b', // Slate 500
        muted: '#94a3b8', // Slate 400

        // Gradient stops
        'gradient-start': '#6366f1', // Indigo
        'gradient-end': '#3b82f6', // Blue
      },
      fontFamily: {
        heading: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        // Premium shadow system
        'sm': '0 1px 2px 0 rgba(99, 102, 241, 0.05)',
        DEFAULT: '0 4px 24px rgba(99, 102, 241, 0.08)',
        'md': '0 8px 32px rgba(99, 102, 241, 0.12)',
        'lg': '0 20px 40px rgba(99, 102, 241, 0.15)',
        'xl': '0 32px 64px rgba(99, 102, 241, 0.18)',
        '2xl': '0 48px 96px rgba(99, 102, 241, 0.2)',
        // Glassmorphism shadows
        'glass': '0 8px 32px rgba(99, 102, 241, 0.1), 0 1px 0 rgba(255, 255, 255, 0.2) inset',
        'glass-lg': '0 16px 48px rgba(99, 102, 241, 0.15), 0 1px 0 rgba(255, 255, 255, 0.2) inset',
        // Colored shadows
        'primary': '0 8px 32px rgba(99, 102, 241, 0.24)',
        'secondary': '0 8px 32px rgba(59, 130, 246, 0.24)',
        'accent': '0 8px 32px rgba(139, 92, 246, 0.24)',
      },
      backdropBlur: {
        'glass': '12px',
        'glass-lg': '20px',
      },
      animation: {
        // Existing
        'fade-in-up': 'fadeInUp 0.6s ease-out',

        // Premium animations
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
