import React from 'react';

/**
 * Modern AI Chatbot Robot Logo
 * Professional, friendly design for LearnKart AI Assistant
 */
const ChatbotLogo = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.8 }} />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
      </filter>
    </defs>

    {/* Head - Main body */}
    <rect
      x="25"
      y="20"
      width="50"
      height="55"
      rx="8"
      fill="url(#robotGradient)"
      filter="url(#shadow)"
    />

    {/* Top antenna left */}
    <rect
      x="35"
      y="8"
      width="4"
      height="15"
      rx="2"
      fill="currentColor"
      opacity="0.7"
    />

    {/* Top antenna right */}
    <rect
      x="61"
      y="8"
      width="4"
      height="15"
      rx="2"
      fill="currentColor"
      opacity="0.7"
    />

    {/* Antenna balls */}
    <circle cx="37" cy="6" r="3" fill="currentColor" opacity="0.9" />
    <circle cx="63" cy="6" r="3" fill="currentColor" opacity="0.9" />

    {/* Face panel/screen effect */}
    <rect
      x="30"
      y="28"
      width="40"
      height="38"
      rx="6"
      fill="white"
      opacity="0.1"
    />

    {/* Left eye - Display */}
    <rect
      x="33"
      y="35"
      width="13"
      height="15"
      rx="3"
      fill="white"
      filter="url(#shadow)"
    />
    
    {/* Left eye iris */}
    <circle cx="39.5" cy="42.5" r="4" fill="currentColor" />
    
    {/* Left eye highlight */}
    <circle cx="38" cy="40.5" r="1.5" fill="white" />

    {/* Right eye - Display */}
    <rect
      x="54"
      y="35"
      width="13"
      height="15"
      rx="3"
      fill="white"
      filter="url(#shadow)"
    />
    
    {/* Right eye iris */}
    <circle cx="60.5" cy="42.5" r="4" fill="currentColor" />
    
    {/* Right eye highlight */}
    <circle cx="59" cy="40.5" r="1.5" fill="white" />

    {/* Mouth - chat indicator */}
    <path
      d="M 38 55 Q 50 62 62 55"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />

    {/* Chat bubble indicator - small */}
    <path
      d="M 72 32 L 80 26 L 75 32 Q 77 38 72 40 Z"
      fill="currentColor"
      opacity="0.8"
    />

    {/* Chest panel detail */}
    <rect
      x="35"
      y="65"
      width="30"
      height="8"
      rx="2"
      fill="white"
      opacity="0.08"
    />

    {/* Center detail lines */}
    <path
      d="M 48 66 L 48 72"
      stroke="white"
      strokeWidth="1"
      opacity="0.15"
    />
    <path
      d="M 52 66 L 52 72"
      stroke="white"
      strokeWidth="1"
      opacity="0.15"
    />
  </svg>
);

export const ChatbotLogoComponent = ChatbotLogo;
export default ChatbotLogo;
