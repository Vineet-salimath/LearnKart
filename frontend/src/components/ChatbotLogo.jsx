import React from 'react';

/**
 * AI Assistant Robot Logo with Graduation Cap
 * Modern, friendly design for LearnKart AI Assistant
 */
const ChatbotLogo = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Graduation cap */}
    <path
      d="M4 8L12 4L20 8V9H4V8Z"
      fill="currentColor"
    />
    <rect
      x="11.5"
      y="8.5"
      width="1"
      height="2"
      fill="currentColor"
    />
    
    {/* Cap shadow/3D effect */}
    <path
      d="M4 8L12 4L20 8"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />

    {/* Robot head/circle */}
    <circle
      cx="12"
      cy="15"
      r="5"
      fill="currentColor"
      opacity="0.8"
    />

    {/* Left eye */}
    <circle
      cx="10"
      cy="14"
      r="1"
      fill="white"
    />

    {/* Right eye */}
    <circle
      cx="14"
      cy="14"
      r="1"
      fill="white"
    />

    {/* Smile/mouth */}
    <path
      d="M10 16C10 16.5 11 17 12 17C13 17 14 16.5 14 16"
      stroke="white"
      strokeWidth="0.8"
      fill="none"
      strokeLinecap="round"
    />

    {/* Antenna or spark */}
    <circle
      cx="14"
      cy="10"
      r="0.8"
      fill="currentColor"
    />
    <path
      d="M14 10 L15 8"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

export const ChatbotLogoComponent = ChatbotLogo;
export default ChatbotLogo;
