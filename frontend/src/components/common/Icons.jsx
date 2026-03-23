import React from 'react';

/**
 * LearnKart Icon System
 * Unified, modern icon set for consistent branding
 * 
 * Design Guidelines:
 * - Stroke width: 1.5-2 pixels
 * - Size: Always use size prop (24, 32, 48)
 * - Colors: Use currentColor for flexibility
 * - Usage: Everywhere in the app for consistency
 */

// ============================================
// CHATBOT & AI ICONS
// ============================================

/**
 * AI Assistant Robot with Graduation Cap
 * Used in: Chat header, chat bubbles, floating button
 */
export const ChatbotLogo = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="chatbotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#06b6d4', stopOpacity:1}} />
      </linearGradient>
    </defs>

    {/* Outer circle background */}
    <circle cx="40" cy="40" r="38" fill="url(#chatbotGradient)" />

    {/* Speech bubble - top right */}
    <g>
      {/* Bubble container */}
      <rect x="32" y="12" width="28" height="18" rx="4" fill="white" fillOpacity="0.9" />
      
      {/* Speech bubble tail */}
      <path
        d="M 38 30 L 42 26 L 40 30 Z"
        fill="white"
        fillOpacity="0.9"
      />

      {/* Text lines inside bubble */}
      <line x1="36" y1="17" x2="56" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="36" y1="22" x2="52" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </g>

    {/* Robot body - rounded rectangle */}
    <rect
      x="20"
      y="38"
      width="40"
      height="32"
      rx="6"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Left eye */}
    <circle cx="30" cy="48" r="3" fill="none" stroke="white" strokeWidth="2" />
    
    {/* Right eye */}
    <circle cx="50" cy="48" r="3" fill="none" stroke="white" strokeWidth="2" />

    {/* Mouth - curved line */}
    <path
      d="M 32 56 Q 40 60 48 56"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Left arm */}
    <path
      d="M 20 50 Q 10 48 8 40"
      stroke="white"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Left hand */}
    <circle cx="8" cy="40" r="2.5" fill="white" />

    {/* Right arm */}
    <path
      d="M 60 50 Q 70 48 72 40"
      stroke="white"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Right hand */}
    <circle cx="72" cy="40" r="2.5" fill="white" />

    {/* Antenna - top center of head */}
    <g>
      <line x1="40" y1="38" x2="40" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="24" r="2.5" fill="white" />
    </g>
  </svg>
);

// ============================================
// DASHBOARD ICONS
// ============================================

/**
 * Dashboard Icon - Grid/Stats focused
 * Used in: Navigation, menu items
 */
export const DashboardIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main dashboard grid */}
    <rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.9" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.7" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.7" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.5" />
    
    {/* Accent bar */}
    <path
      d="M3 22L21 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// ============================================
// COURSE ICONS
// ============================================

/**
 * Courses Icon - Book/Video focused
 * Used in: Navigation, course listings
 */
export const CoursesIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Book spine */}
    <path
      d="M4 3C3.45 3 3 3.45 3 4V21C3 21.55 3.45 22 4 22H18C18.55 22 19 21.55 19 21V4C19 3.45 18.55 3 18 3H4Z"
      fill="currentColor"
      opacity="0.8"
    />

    {/* Play button on book (video indicator) */}
    <path
      d="M11 11L15 14L11 17V11Z"
      fill="white"
      opacity="0.9"
    />

    {/* Book pages indicator */}
    <path
      d="M4 6H18M4 12H18M4 18H18"
      stroke="white"
      strokeWidth="0.8"
      opacity="0.6"
      strokeLinecap="round"
    />
  </svg>
);

// ============================================
// CERTIFICATE ICONS
// ============================================

/**
 * Certificates Icon - Achievement/Badge focused
 * Used in: Navigation, achievements display
 */
export const CertificatesIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Certificate scroll background */}
    <path
      d="M3 6C3 4.9 3.9 4 5 4H19C20.1 4 21 4.9 21 6V16C21 17.1 20.1 18 19 18H5C3.9 18 3 17.1 3 16V6Z"
      fill="currentColor"
      opacity="0.8"
    />

    {/* Top ribbon rolls */}
    <path
      d="M6 2L4 4L4 8C4 10 5 11 6 11C7 11 8 10 8 8L8 4L6 2Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M18 2L20 4L20 8C20 10 19 11 18 11C17 11 16 10 16 8L16 4L18 2Z"
      fill="currentColor"
      opacity="0.9"
    />

    {/* Badge/Medal in center */}
    <circle cx="12" cy="10" r="4" fill="white" opacity="0.9" />
    <path
      d="M12 9L13 11L15 11L13.5 12.5L14 14L12 13L10 14L10.5 12.5L9 11L11 11Z"
      fill="currentColor"
      opacity="0.8"
    />

    {/* Decorative lines */}
    <path
      d="M6 15H18"
      stroke="white"
      strokeWidth="0.8"
      opacity="0.5"
      strokeLinecap="round"
    />
  </svg>
);

// ============================================
// BRAND ICONS
// ============================================

/**
 * LearnKart Brand Logo
 * Used in: Footer, header, branding elements
 */
export const LearnKartLogo = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main circular badge */}
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.9" />

    {/* Learning symbol - open book with sparkle */}
    <path
      d="M8 10L12 14L16 10"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Sparkle/star - achievement indicator */}
    <path
      d="M14 6L14.5 7.5L16 8L14.5 8.5L14 10L13.5 8.5L12 8L13.5 7.5Z"
      fill="white"
      opacity="0.8"
    />

    {/* Bottom accent */}
    <path
      d="M10 16L14 16"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

// ============================================
// UTILITY ICONS (Custom variants)
// ============================================

/**
 * Online Status Indicator
 * Used in: Chat header, user presence
 */
export const OnlineStatus = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="8" cy="8" r="6" fill="currentColor" opacity="0.8" />
    <circle cx="8" cy="8" r="4" fill="currentColor" />
  </svg>
);

// ============================================
// EXPORT ALL ICONS
// ============================================

export const Icons = {
  ChatbotLogo,
  DashboardIcon,
  CoursesIcon,
  CertificatesIcon,
  LearnKartLogo,
  OnlineStatus,
};

export default Icons;

