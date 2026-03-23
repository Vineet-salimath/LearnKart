import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const Logo = ({ variant = 'default', size = 'md', className, animated = true }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const LogoSvg = React.forwardRef(({ className: svgClassName }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('transition-all duration-300', svgClassName)}
    >
      <circle cx="22" cy="22" r="21" fill="url(#bgGlow)" opacity="0.65" />

      {/* Brand Frame */}
      <rect
        x="4"
        y="4"
        width="36"
        height="36"
        rx="11"
        fill="url(#surface)"
        stroke="url(#borderGlow)"
        strokeWidth="1"
      />

      {/* Abstract Book / K Monogram */}
      <path
        d="M11 14.2C11 12.99 11.99 12 13.2 12H19.1C20.3 12 21.28 12.98 21.28 14.18V29.82C21.28 31.02 20.3 32 19.1 32H13.2C11.99 32 11 31.01 11 29.8V14.2Z"
        fill="url(#iconGradient)"
      />
      <path
        d="M22.72 14.2C22.72 12.99 23.71 12 24.92 12H30.8C32.01 12 33 12.99 33 14.2V29.8C33 31.01 32.01 32 30.8 32H24.92C23.71 32 22.72 31.01 22.72 29.8V14.2Z"
        fill="url(#iconGradient2)"
      />
      <path
        d="M14.6 22H18.9C19.54 22 20.13 22.26 20.55 22.72L29.5 32"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6 22L19.2 12.6"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M25 12.6L19.3 22"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Orbit / Innovation Nodes */}
      <motion.circle cx="10.5" cy="10.5" r="1.7" fill="#8b5cf6" opacity="0.95" />
      <motion.circle cx="33.8" cy="9.8" r="1.2" fill="#22c55e" opacity="0.9" />
      <motion.circle cx="35.8" cy="33.5" r="1.5" fill="#60a5fa" opacity="0.85" />
      <motion.path
        d="M10.5 10.5L18.5 13"
        stroke="rgba(139,92,246,0.8)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <motion.path
        d="M33.8 9.8L27.8 12"
        stroke="rgba(34,197,94,0.8)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Gradient Definitions */}
      <defs>
        <radialGradient id="bgGlow" cx="0.5" cy="0.35" r="0.75">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#111827" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#060816" stopOpacity="0.05" />
        </radialGradient>
        <linearGradient id="surface" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
        <linearGradient id="borderGlow" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="iconGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient
          id="iconGradient2"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
    </svg>
  ));

  LogoSvg.displayName = 'LogoSvg';

  const AnimatedLogo = motion(LogoSvg);

  const logoVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      rotate: -10
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={cn('inline-flex items-center gap-3 select-none', className)}>
      <div className={cn('relative shrink-0', sizes[size])}>
        {animated ? (
          <AnimatedLogo
            className="w-full h-full"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          />
        ) : (
          <LogoSvg className="w-full h-full" />
        )}
      </div>

      {variant === 'withText' && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { delay: 0.2, duration: 0.5 }
          }}
          className="flex flex-col leading-none"
        >
          <span className="font-heading text-[clamp(1.25rem,1.5vw,1.75rem)] font-extrabold tracking-tight">
            <span style={{ color: 'var(--text-primary)' }}>Learn</span>
            <span
              style={{
                background: 'linear-gradient(90deg, #8b5cf6 0%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Kart
            </span>
          </span>
          {size === 'xl' && (
            <span className="mt-1 text-[10px] font-semibold tracking-[0.32em] uppercase" style={{ color: 'var(--text-tertiary)' }}>
              Learn without limits
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Icon-only variant for compact usage
export const LogoIcon = ({ size = 'md', className, animated = true }) => {
  return (
    <Logo
      variant="icon"
      size={size}
      className={className}
      animated={animated}
    />
  );
};

// Full brand logo with text
export const BrandLogo = ({ size = 'lg', className, animated = true }) => {
  return (
    <Logo
      variant="withText"
      size={size}
      className={className}
      animated={animated}
    />
  );
};