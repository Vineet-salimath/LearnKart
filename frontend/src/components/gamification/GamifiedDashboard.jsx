import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  TrendingUp,
  BookOpen,
  Clock,
  Target,
  Users,
  Award,
  Calendar,
  Flame,
  ChevronRight,
  Download
} from 'lucide-react';
import { CircularProgress, XPProgressBar } from './ProgressComponents';
import { Badge, BadgeGrid, AchievementNotification } from './BadgeSystem';
import { Card } from '../common/Card';
import { cn } from '../../utils/helpers';

// Mock gamification data (would come from API)
const mockGamificationData = {
  user: {
    level: 8,
    currentXP: 3420,
    requiredXP: 4000,
    totalXP: 15420,
    streak: 12,
    coursesCompleted: 6,
    totalCourses: 12,
    studyTime: 145, // hours
    rank: 'Advanced Learner'
  },
  badges: [
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your first course',
      icon: 'first_course',
      rarity: 'common',
      unlocked: true,
      unlockedAt: '2024-01-15',
      xpReward: 100
    },
    {
      id: 2,
      name: 'Speed Demon',
      description: 'Complete 3 lessons in one day',
      icon: 'speedster',
      rarity: 'uncommon',
      unlocked: true,
      unlockedAt: '2024-02-01',
      xpReward: 200
    },
    {
      id: 3,
      name: 'Rising Star',
      description: 'Maintain a 7-day learning streak',
      icon: 'rising_star',
      rarity: 'rare',
      unlocked: true,
      unlockedAt: '2024-02-15',
      xpReward: 300
    },
    {
      id: 4,
      name: 'Expert',
      description: 'Complete 10 courses with 90%+ score',
      icon: 'expert',
      rarity: 'epic',
      unlocked: false,
      requirement: 'Complete 10 courses with 90%+ score',
      xpReward: 500
    },
    {
      id: 5,
      name: 'Master',
      description: 'Reach level 15',
      icon: 'master',
      rarity: 'legendary',
      unlocked: false,
      requirement: 'Reach level 15',
      xpReward: 1000
    },
    {
      id: 6,
      name: 'Legend',
      description: 'Top 1% of all learners globally',
      icon: 'legend',
      rarity: 'mythic',
      unlocked: false,
      requirement: 'Top 1% globally',
      xpReward: 2000
    }
  ],
  achievements: [
    {
      title: 'Course Master',
      description: 'Completed 5 courses this month',
      xp: '+500 XP',
      date: '2 days ago',
      type: 'course'
    },
    {
      title: 'Streak Keeper',
      description: '10-day learning streak achieved',
      xp: '+200 XP',
      date: '5 days ago',
      type: 'streak'
    }
  ],
  stats: [
    {
      label: 'Courses Completed',
      value: 6,
      total: 12,
      percentage: 50,
      icon: BookOpen,
      color: 'primary'
    },
    {
      label: 'Study Hours',
      value: 145,
      change: '+15 this week',
      icon: Clock,
      color: 'secondary'
    },
    {
      label: 'Current Streak',
      value: 12,
      unit: 'days',
      icon: Flame,
      color: 'warning'
    },
    {
      label: 'Global Rank',
      value: 2847,
      change: '↑ 156',
      icon: TrendingUp,
      color: 'success'
    }
  ]
};

export const GamifiedDashboard = ({ className }) => {
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);

  const { user, badges, achievements, stats } = mockGamificationData;

  useEffect(() => {
    // Animate stats on mount
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate achievement unlock
  const simulateAchievement = () => {
    const achievement = badges.find(b => b.id === 2);
    setNewAchievement({ ...achievement, justUnlocked: true });
    setShowAchievement(true);
  };

  const nextLevel = user.level + 1;
  const courseProgress = (user.coursesCompleted / user.totalCourses) * 100;

  return (
    <div className={cn('space-y-8', className)}>
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && newAchievement && (
          <AchievementNotification
            achievement={newAchievement}
            onClose={() => setShowAchievement(false)}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-primary via-primary to-secondary p-8 text-white overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full transform -translate-x-24 translate-y-24" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* User Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-2xl font-bold">
                  {user.level}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">Level {user.level} • {user.rank}</h1>
                  <p className="text-white/80">Keep up the amazing progress!</p>
                </div>
              </div>

              <XPProgressBar
                currentXP={user.currentXP}
                requiredXP={user.requiredXP}
                level={user.level}
                nextLevel={nextLevel}
                animated={animateStats}
                className="text-white [&_*]:text-white [&_*]:text-white/80"
              />
            </motion.div>
          </div>

          {/* Course Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="text-center">
              <CircularProgress
                progress={courseProgress}
                size="xl"
                color="primary"
                animated={animateStats}
                className="mb-4"
              />
              <h3 className="text-lg font-semibold mb-1">Course Progress</h3>
              <p className="text-white/80">{user.coursesCompleted} of {user.totalCourses} completed</p>
            </div>
          </motion.div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl',
                    stat.color === 'primary' && 'bg-primary/10 text-primary',
                    stat.color === 'secondary' && 'bg-secondary/10 text-secondary',
                    stat.color === 'success' && 'bg-success/10 text-success',
                    stat.color === 'warning' && 'bg-warning/10 text-warning'
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <motion.p
                      className="text-2xl font-bold text-text"
                      initial={{ scale: 0 }}
                      animate={{ scale: animateStats ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    >
                      {stat.value.toLocaleString()}{stat.unit && <span className="text-lg">{stat.unit}</span>}
                    </motion.p>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                    {stat.change && (
                      <p className="text-xs text-success mt-1">{stat.change}</p>
                    )}
                    {stat.percentage && (
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            stat.color === 'primary' && 'bg-primary',
                            stat.color === 'secondary' && 'bg-secondary'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: animateStats ? `${stat.percentage}%` : 0 }}
                          transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Badges Section */}
      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text mb-2">Achievements & Badges</h2>
            <p className="text-text-secondary">
              Unlock badges by completing courses and reaching milestones
            </p>
          </div>
          <button
            onClick={simulateAchievement}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Test Achievement
          </button>
        </div>

        <BadgeGrid badges={badges} columns={6} />

        {/* Progress to next badge */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-4">
            <Trophy className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold text-text mb-1">Next Badge: Expert</h3>
              <p className="text-sm text-text-secondary mb-3">
                Complete 4 more courses with 90%+ score to unlock
              </p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full w-3/5" />
              </div>
              <p className="text-xs text-text-tertiary mt-2">6/10 courses completed</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-text mb-6">Recent Achievements</h2>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-success/5 to-primary/5 rounded-xl border border-success/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-success to-primary text-white">
                <Award className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text">{achievement.title}</h3>
                <p className="text-sm text-text-secondary">{achievement.description}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-success">{achievement.xp}</span>
                <p className="text-xs text-text-tertiary">{achievement.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Certificate Section */}
      <Card className="p-8 bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-white to-slate-200 text-[var(--bg)]">
            <Award className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text mb-2">Earn Your Certificate</h3>
            <p className="text-text-secondary mb-4">
              Complete 2 more courses to earn your Advanced Web Development Certificate
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-white to-slate-200 rounded-full w-4/5" />
              </div>
              <span className="text-sm font-semibold text-white">10/12</span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white to-slate-200 text-[var(--bg)] font-semibold rounded-xl hover:from-slate-100 hover:to-slate-300 transition-colors">
            <Download className="h-5 w-5" />
            Preview
          </button>
        </div>
      </Card>
    </div>
  );
};