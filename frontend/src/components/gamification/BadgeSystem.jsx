import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Trophy,
  Star,
  Zap,
  Target,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Flame,
  Crown,
  Shield,
  Gem,
  Rocket,
  Lock
} from 'lucide-react';
import { cn } from '../../utils/helpers';

// Badge icon mapping
const badgeIcons = {
  first_course: BookOpen,
  speedster: Zap,
  dedicated: Clock,
  achiever: Target,
  social: Users,
  expert: Trophy,
  master: Crown,
  legend: Gem,
  streak: Flame,
  rising_star: Star,
  top_performer: TrendingUp,
  protector: Shield,
  pioneer: Rocket,
  default: Award,
};

// Badge rarity colors
const rarityColors = {
  common: {
    bg: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-400/50',
    border: 'border-gray-300'
  },
  uncommon: {
    bg: 'from-green-400 to-green-600',
    glow: 'shadow-green-400/50',
    border: 'border-green-300'
  },
  rare: {
    bg: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-400/50',
    border: 'border-blue-300'
  },
  epic: {
    bg: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-400/50',
    border: 'border-purple-300'
  },
  legendary: {
    bg: 'from-white via-slate-200 to-slate-400',
    glow: 'shadow-white/40',
    border: 'border-white/20'
  },
  mythic: {
    bg: 'from-pink-400 via-purple-500 to-indigo-500',
    glow: 'shadow-pink-400/50',
    border: 'border-pink-300'
  }
};

export const Badge = ({
  badge,
  size = 'md',
  showTooltip = true,
  unlockEffect = false,
  onClick,
  className
}) => {
  const [showUnlock, setShowUnlock] = useState(unlockEffect);
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const IconComponent = badgeIcons[badge.icon] || badgeIcons.default;
  const colors = rarityColors[badge.rarity] || rarityColors.common;

  const badgeVariants = {
    locked: {
      scale: 0.9,
      opacity: 0.4,
      filter: 'grayscale(1)',
    },
    unlocked: {
      scale: 1,
      opacity: 1,
      filter: 'grayscale(0)',
    },
    hover: {
      scale: 1.1,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const unlockAnimation = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: {
      scale: [0, 1.3, 1],
      rotate: [0, 360, 360],
      opacity: 1,
      transition: {
        duration: 0.8,
        times: [0, 0.6, 1],
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    initial: { scale: 1, opacity: 0 },
    animate: {
      scale: [1, 1.5, 1.2],
      opacity: [0, 0.8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={cn('relative cursor-pointer', className)}
      variants={badgeVariants}
      initial="locked"
      animate={badge.unlocked ? "unlocked" : "locked"}
      whileHover={badge.unlocked ? "hover" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Badge Container */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-2xl border-2 p-3',
          sizes[size],
          badge.unlocked ? colors.border : 'border-gray-300'
        )}
      >
        {/* Background Gradient */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-90',
            badge.unlocked ? colors.bg : 'from-gray-300 to-gray-400'
          )}
        />

        {/* Glow Effect */}
        {badge.unlocked && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-2xl bg-gradient-to-br blur-md',
              colors.bg,
              colors.glow
            )}
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />
        )}

        {/* Badge Icon */}
        <div className="relative z-10">
          {badge.unlocked ? (
            <IconComponent className="h-6 w-6 text-white" />
          ) : (
            <Lock className="h-6 w-6 text-gray-500" />
          )}
        </div>

        {/* Unlock Animation */}
        <AnimatePresence>
          {showUnlock && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={unlockAnimation}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0 }}
              onAnimationComplete={() => setShowUnlock(false)}
            >
              <div className={cn(
                'flex items-center justify-center rounded-2xl bg-gradient-to-br p-3',
                sizes[size],
                colors.bg
              )}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rarity Indicator */}
        {badge.unlocked && (
          <div className="absolute -top-1 -right-1 h-4 w-4">
            <div className={cn(
              'h-full w-full rounded-full border border-white',
              colors.bg
            )} />
          </div>
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-center min-w-max">
              <h4 className="font-semibold mb-1">{badge.name}</h4>
              <p className="text-sm text-gray-300 mb-2">{badge.description}</p>
              <div className="flex items-center justify-center gap-2">
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium',
                  badge.unlocked ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'
                )}>
                  {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                </span>
                {badge.unlocked && badge.unlockedAt && (
                  <span className="text-xs text-gray-400">
                    Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {!badge.unlocked && badge.requirement && (
                <p className="text-xs text-white/70 mt-2">
                  Requirement: {badge.requirement}
                </p>
              )}
            </div>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 mx-auto" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Badge Grid Component
export const BadgeGrid = ({ badges, columns = 4, className }) => {
  return (
    <div
      className={cn(
        'grid gap-4',
        `grid-cols-${columns}`,
        className
      )}
    >
      {badges.map((badge) => (
        <Badge
          key={badge.id}
          badge={badge}
          unlockEffect={badge.justUnlocked}
        />
      ))}
    </div>
  );
};

// Achievement Notification
export const AchievementNotification = ({ achievement, onClose }) => {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed top-4 right-4 z-50 bg-white rounded-2xl shadow-2xl p-6 border-l-4 border-primary max-w-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Badge
            badge={achievement}
            size="md"
            showTooltip={false}
            unlockEffect={true}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-text mb-1">Achievement Unlocked!</h3>
          <h4 className="font-semibold text-primary mb-1">{achievement.name}</h4>
          <p className="text-sm text-text-secondary mb-3">{achievement.description}</p>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              +{achievement.xpReward} XP
            </span>
            <span className="text-xs text-text-tertiary">
              {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};