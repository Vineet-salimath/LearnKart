import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const CircularProgress = ({
  progress,
  size = 'md',
  strokeWidth = 4,
  color = 'primary',
  showText = true,
  animated = true,
  className
}) => {
  const sizes = {
    sm: { width: 60, height: 60, text: 'text-sm' },
    md: { width: 80, height: 80, text: 'text-base' },
    lg: { width: 120, height: 120, text: 'text-lg' },
    xl: { width: 160, height: 160, text: 'text-xl' },
  };

  const { width, height, text } = sizes[size];
  const radius = (width - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colors = {
    primary: {
      stroke: 'url(#primary-gradient)',
      bg: 'stroke-primary/20'
    },
    secondary: {
      stroke: 'url(#secondary-gradient)',
      bg: 'stroke-secondary/20'
    },
    success: {
      stroke: 'url(#success-gradient)',
      bg: 'stroke-success/20'
    },
    warning: {
      stroke: 'url(#warning-gradient)',
      bg: 'stroke-warning/20'
    }
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="secondary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="warning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Background Circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          className={colors[color].bg}
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <motion.circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={colors[color].stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: animated ? strokeDashoffset : circumference - (progress / 100) * circumference
          }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: "easeOut"
          }}
        />
      </svg>

      {/* Progress Text */}
      {showText && (
        <motion.div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center font-semibold',
            text
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-text">{Math.round(progress)}%</span>
          {size === 'lg' || size === 'xl' ? (
            <span className="text-xs text-text-tertiary mt-1">Complete</span>
          ) : null}
        </motion.div>
      )}
    </div>
  );
};

// XP Progress Bar Component
export const XPProgressBar = ({
  currentXP,
  requiredXP,
  level,
  nextLevel,
  className,
  animated = true
}) => {
  const progress = (currentXP / requiredXP) * 100;
  const remainingXP = requiredXP - currentXP;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Level Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold">
            {level}
          </div>
          <div>
            <p className="font-semibold text-text">Level {level}</p>
            <p className="text-sm text-text-secondary">
              {remainingXP} XP to Level {nextLevel}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold text-text">{currentXP.toLocaleString()} XP</p>
          <p className="text-sm text-text-secondary">Total</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: animated ? `${progress}%` : `${progress}%` }}
          transition={{ duration: animated ? 1.2 : 0, ease: "easeOut" }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur-sm"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: animated ? `${progress}%` : `${progress}%`,
            opacity: 0.6
          }}
          transition={{ duration: animated ? 1.2 : 0, ease: "easeOut" }}
        />
      </div>

      {/* XP Numbers */}
      <div className="flex justify-between text-sm text-text-secondary">
        <span>0</span>
        <span>{requiredXP.toLocaleString()}</span>
      </div>
    </div>
  );
};