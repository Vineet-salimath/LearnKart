/**
 * LearnKart Design System
 * Production-ready design system for the LMS platform
 * 
 * Version: 1.0.0
 * Last Updated: March 2026
 */

// ============================================
// COLOR PALETTE
// ============================================
export const COLORS = {
  primary: {
    light: '#3b82f6',      // Blue
    main: '#2563eb',
    dark: '#1d4ed8',
  },
  secondary: {
    light: '#06b6d4',      // Cyan
    main: '#0891b2',
    dark: '#0e7490',
  },
  accent: {
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
  neutral: {
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    dark: '#0f172a',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warm: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
    cool: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  },
};

// ============================================
// TYPOGRAPHY
// ============================================
export const TYPOGRAPHY = {
  fonts: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    heading: 'Poppins, Inter, sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

// ============================================
// SPACING (8px Grid System)
// ============================================
export const SPACING = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
};

// ============================================
// BORDER RADIUS
// ============================================
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.375rem',    // 6px
  base: '0.5rem',    // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.5rem',      // 24px
  '2xl': '2rem',     // 32px
  full: '9999px',
};

// ============================================
// SHADOWS
// ============================================
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  primary: '0 12px 48px rgba(59, 130, 246, 0.35)',
  accent: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
};

// ============================================
// TRANSITIONS
// ============================================
export const TRANSITIONS = {
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  base: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  slower: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
};

// ============================================
// COMPONENT SIZES
// ============================================
export const SIZES = {
  button: {
    sm: { px: SPACING[3], py: SPACING[2] },
    md: { px: SPACING[4], py: SPACING[2.5] },
    lg: { px: SPACING[6], py: SPACING[3] },
  },
  input: {
    height: '2.75rem',  // 44px
    paddingX: SPACING[4],
    paddingY: SPACING[2.5],
  },
  card: {
    padding: SPACING[6],
    borderRadius: BORDER_RADIUS.lg,
  },
  avatar: {
    sm: '1.75rem',      // 28px
    md: '2.5rem',       // 40px
    lg: '3.5rem',       // 56px
  },
};

// ============================================
// BREAKPOINTS
// ============================================
export const BREAKPOINTS = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================
// Z-INDEX
// ============================================
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  notification: 1070,
  chatWidget: {
    button: 10000,
    widget: 10001,
  },
};

// ============================================
// ANIMATION PRESETS
// ============================================
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

// ============================================
// DEFAULT TRANSITIONS
// ============================================
export const DEFAULT_TRANSITION = {
  duration: 0.2,
  ease: 'easeOut',
};

// ============================================
// RESPONSIVE UTILITIES
// ============================================
export const MEDIA_QUERIES = {
  mobile: `@media (max-width: ${BREAKPOINTS.sm})`,
  tablet: `@media (max-width: ${BREAKPOINTS.md})`,
  desktop: `@media (min-width: ${BREAKPOINTS.lg})`,
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TRANSITIONS,
  SIZES,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATIONS,
  DEFAULT_TRANSITION,
  MEDIA_QUERIES,
};
