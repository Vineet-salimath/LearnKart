import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Save, X, Award, Zap, GraduationCap, Share2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// All courses data for reference
const ALL_COURSES = [
  { id: 1, title: 'React Full Course', author: 'Traversy Media', cat: 'React/Next/TS', lvl: 'Beginner', price: 199, rating: 4.8, students: '32K', ytId: 'bMknfKXIFA8' },
  { id: 2, title: 'Next.js Full Course', author: 'Vercel Team', cat: 'React/Next/TS', lvl: 'Intermediate', price: 299, rating: 4.7, students: '18K', ytId: 'wm5gMKuwSYk' },
  { id: 3, title: 'TypeScript Course', author: 'Matt Pocock', cat: 'React/Next/TS', lvl: 'Intermediate', price: 249, rating: 4.6, students: '14K', ytId: '30LWjhZzg50' },
  { id: 4, title: 'JavaScript Full Course', author: 'FreeCodeCamp', cat: 'JavaScript', lvl: 'Beginner', price: 0, rating: 4.9, students: '95K', ytId: 'PkZNo7MFNFg' },
  { id: 5, title: 'Advanced JavaScript', author: 'Akshay Saini', cat: 'JavaScript', lvl: 'Advanced', price: 349, rating: 4.9, students: '41K', ytId: 'KGkiIBTq0y0' },
  { id: 6, title: 'JS Crash Course', author: 'Traversy Media', cat: 'JavaScript', lvl: 'Beginner', price: 99, rating: 4.5, students: '28K', ytId: 'hdI2bqOjy3c' },
  { id: 7, title: 'Ethical Hacking Full Course', author: 'TCM Security', cat: 'Cybersecurity', lvl: 'Beginner', price: 399, rating: 4.8, students: '22K', ytId: '3Kq1MIfTWCE' },
  { id: 8, title: 'Web Security Fundamentals', author: 'TCM Security', cat: 'Cybersecurity', lvl: 'Intermediate', price: 299, rating: 4.6, students: '11K', ytId: '3Kq1MIfTWCE' },
  { id: 9, title: 'Bug Bounty Guide', author: 'InsiderPhD', cat: 'Cybersecurity', lvl: 'Intermediate', price: 449, rating: 4.7, students: '8K', ytId: 'Pu3gk9K5cZ8' },
  { id: 10, title: 'Practical Ethical Hacking', author: 'Heath Adams', cat: 'Cybersecurity', lvl: 'Advanced', price: 499, rating: 4.9, students: '19K', ytId: 'fNzpcB7ODxQ' },
  { id: 11, title: 'HackTheBox Walkthrough', author: 'IppSec', cat: 'Cybersecurity', lvl: 'Advanced', price: 349, rating: 4.8, students: '7K', ytId: '2eLe7uz-7CM' },
  { id: 12, title: 'Docker Full Course', author: 'TechWorld Nina', cat: 'DevOps', lvl: 'Beginner', price: 199, rating: 4.7, students: '33K', ytId: 'fqMOX6JJhGo' },
  { id: 13, title: 'Kubernetes Full Course', author: 'TechWorld Nina', cat: 'DevOps', lvl: 'Intermediate', price: 349, rating: 4.8, students: '25K', ytId: 'X48VuDVv0do' },
  { id: 14, title: 'Jenkins CI/CD', author: 'Simplilearn', cat: 'DevOps', lvl: 'Intermediate', price: 249, rating: 4.5, students: '12K', ytId: 'FX322RVNGj4' },
  { id: 15, title: 'DevOps Roadmap', author: 'TechWorld', cat: 'DevOps', lvl: 'Beginner', price: 0, rating: 4.6, students: '44K', ytId: '9pZ2xmsSDdo' },
  { id: 16, title: 'Linux for Beginners', author: 'DorianDotSlash', cat: 'DevOps', lvl: 'Beginner', price: 149, rating: 4.7, students: '38K', ytId: 'ivd3b6z2d4k' },
  { id: 17, title: 'Mobile App Security Android', author: 'STÖK', cat: 'Mobile Security', lvl: 'Intermediate', price: 399, rating: 4.6, students: '6K', ytId: 'HhF0X9cXH6E' },
  { id: 18, title: 'OWASP Top 10 AppSec', author: 'TCM Security', cat: 'Mobile Security', lvl: 'Advanced', price: 449, rating: 4.8, students: '9K', ytId: '3Kq1MIfTWCE' },
  { id: 19, title: 'System Design Basics', author: 'Gaurav Sen', cat: 'System Design', lvl: 'Intermediate', price: 299, rating: 4.9, students: '52K', ytId: 'UzLMhqg3_Wc' },
  { id: 20, title: 'Microservices Architecture', author: 'Tech Primers', cat: 'System Design', lvl: 'Advanced', price: 399, rating: 4.7, students: '16K', ytId: 'rv4LlmLmVWk' },
  { id: 21, title: 'Node.js Full Course', author: 'FreeCodeCamp', cat: 'Backend', lvl: 'Beginner', price: 0, rating: 4.8, students: '67K', ytId: 'Oe421EPjeBE' },
  { id: 22, title: 'SQL Full Course', author: 'FreeCodeCamp', cat: 'Database', lvl: 'Beginner', price: 0, rating: 4.9, students: '88K', ytId: 'HXV3zeQKqGY' },
  { id: 23, title: 'PostgreSQL Complete', author: 'Amigoscode', cat: 'Database', lvl: 'Intermediate', price: 249, rating: 4.7, students: '21K', ytId: 'qw--VYLpxG4' },
  { id: 24, title: 'MongoDB Full Course', author: 'FreeCodeCamp', cat: 'Database', lvl: 'Beginner', price: 149, rating: 4.6, students: '29K', ytId: 'ofme2o29ngU' },
  { id: 25, title: 'Python Full Course', author: 'FreeCodeCamp', cat: 'Python', lvl: 'Beginner', price: 0, rating: 4.9, students: '112K', ytId: 'rfscVS0vtbw' },
  { id: 26, title: 'Python OOP', author: 'Corey Schafer', cat: 'Python', lvl: 'Intermediate', price: 199, rating: 4.8, students: '34K', ytId: 'JeznW_7DlB0' },
  { id: 27, title: 'Python Projects', author: 'Tech With Tim', cat: 'Python', lvl: 'Intermediate', price: 249, rating: 4.7, students: '27K', ytId: '8ext9G7xspg' },
  { id: 28, title: 'Automation with Python', author: 'FreeCodeCamp', cat: 'Python', lvl: 'Advanced', price: 299, rating: 4.6, students: '19K', ytId: 'PXMJ6FS7llk' },
  { id: 29, title: 'CI/CD Advanced Pipeline', author: 'DevOps Directive', cat: 'Extra', lvl: 'Advanced', price: 349, rating: 4.7, students: '8K', ytId: 'scEDHsr3APg' },
  { id: 30, title: 'Advanced Web Dev Project', author: 'Traversy Media', cat: 'Extra', lvl: 'Advanced', price: 399, rating: 4.8, students: '11K', ytId: 'Ke90Tje7VS0' },
];

// Badge definitions
const BADGE_DEFINITIONS = [
  { id: 1, icon: '🔥', name: 'First Enrollment', description: 'Enroll in your first course', xp: 10, condition: 'enrollments >= 1' },
  { id: 2, icon: '🎯', name: 'Fast Learner', description: 'Complete a course in under 7 days', xp: 50, condition: 'courseCompletedIn7Days' },
  { id: 3, icon: '🏆', name: 'Top Student', description: 'Complete 5 courses', xp: 100, condition: 'coursesCompleted >= 5' },
  { id: 4, icon: '🌟', name: 'Perfect Score', description: 'Score 100% on a quiz', xp: 75, condition: 'perfectScore' },
  { id: 5, icon: '⭐', name: 'Beginner', description: 'Complete your first course', xp: 25, condition: 'coursesCompleted >= 1' },
  { id: 6, icon: '💎', name: 'Advanced Learner', description: 'Complete 10 courses', xp: 150, condition: 'coursesCompleted >= 10' },
];

// Level thresholds
const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, maxXp: 100, title: 'Novice' },
  { level: 2, minXp: 101, maxXp: 300, title: 'Learner' },
  { level: 3, minXp: 301, maxXp: 600, title: 'Explorer' },
  { level: 4, minXp: 601, maxXp: 1000, title: 'Scholar' },
  { level: 5, minXp: 1001, maxXp: 1500, title: 'Code Master' },
  { level: 6, minXp: 1501, maxXp: 2100, title: 'Expert' },
];

function getLevelInfo(xp) {
  for (let threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.minXp && xp <= threshold.maxXp) {
      const currentXp = xp - threshold.minXp;
      const maxXpForLevel = threshold.maxXp - threshold.minXp;
      return {
        level: threshold.level,
        title: threshold.title,
        currentXp,
        maxXpForLevel,
        progress: Math.round((currentXp / maxXpForLevel) * 100),
      };
    }
  }
  return { level: 6, title: 'Expert', currentXp: 0, maxXpForLevel: 1, progress: 100 };
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState('');
  const [activeTab, setActiveTab] = useState('courses');
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = localStorage.getItem('enrolledCourses');
    return saved ? JSON.parse(saved) : [];
  });
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats') || '{}';
    const stats = JSON.parse(saved);
    return {
      totalXp: stats.totalXp || 0,
      badges: stats.badges || [],
      certificates: stats.certificates || [],
      joinDate: stats.joinDate || new Date().toLocaleDateString(),
      courseProgress: stats.courseProgress || {},
    };
  });

  const levelInfo = getLevelInfo(userStats.totalXp);

  // Get enrolled course details
  const myCoursesData = enrolledCourses
    .map(id => ALL_COURSES.find(c => c.id === id))
    .filter(Boolean);

  const updateStats = (newStats) => {
    setUserStats(newStats);
    localStorage.setItem('userStats', JSON.stringify(newStats));
  };

  const handleSaveProfile = () => {
    updateStats({
      ...userStats,
      bio: editBio,
    });
    setIsEditing(false);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingTop: '20px', paddingBottom: '40px' }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Learning Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track your progress and achievements
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b flex-wrap" style={{ borderColor: 'var(--border)' }}>
          {['courses', 'badges', 'xp', 'certificates'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold transition-colors capitalize ${
                activeTab === tab ? 'border-b-2' : ''
              }`}
              style={{
                color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottomColor: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
              }}
            >
              {tab === 'xp' ? 'XP & Levels' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile Section - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-xl"
          style={{ backgroundColor: 'var(--surface)', border: `1px solid var(--border)` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                style={{ backgroundColor: 'var(--bg2)' }}
              >
                👤
              </div>

              {/* Profile Info */}
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-2xl font-bold px-3 py-1 rounded-lg"
                      style={{
                        backgroundColor: 'var(--bg2)',
                        color: 'var(--text-primary)',
                        border: `1px solid var(--border)`,
                      }}
                    />
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Add a bio..."
                      className="px-3 py-2 rounded-lg w-full text-sm"
                      style={{
                        backgroundColor: 'var(--bg2)',
                        color: 'var(--text-primary)',
                        border: `1px solid var(--border)`,
                      }}
                      rows="2"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {editName}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {editBio || 'No bio added yet'}
                    </p>
                  </>
                )}
                <div className="flex gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>Joined {userStats.joinDate}</span>
                  <span>•</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                    Level {levelInfo.level} — {levelInfo.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    <Save size={18} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(user?.name || '');
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg"
                    style={{ backgroundColor: 'var(--bg2)', color: 'var(--text-primary)' }}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditBio(userStats.bio || '');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                  style={{ backgroundColor: 'var(--bg2)', color: 'var(--text-primary)' }}
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* XP & Progress Bar */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: 'var(--text-secondary)' }}>
                Level Progress: {levelInfo.currentXp}/{levelInfo.maxXpForLevel} XP
              </span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                {userStats.totalXp} Total XP
              </span>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--bg2)' }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 0.8 }}
                style={{ backgroundColor: 'var(--accent-primary)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                My Courses ({myCoursesData.length})
              </h2>

              {myCoursesData.length === 0 ? (
                <div
                  className="text-center py-12 rounded-xl"
                  style={{ backgroundColor: 'var(--surface)', border: `1px solid var(--border)` }}
                >
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    No courses enrolled yet
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Start learning by enrolling in a course
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCoursesData.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl overflow-hidden"
                      style={{ backgroundColor: 'var(--surface)', border: `1px solid var(--border)` }}
                    >
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <img
                          src={`https://img.youtube.com/vi/${course.ytId}/hqdefault.jpg`}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Course Info */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-bold text-lg line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                          {course.title}
                        </h3>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                            <span>Progress</span>
                            <span>{userStats.courseProgress[course.id] || 0}%</span>
                          </div>
                          <div
                            className="w-full h-2 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'var(--bg2)' }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${userStats.courseProgress[course.id] || 0}%`,
                                backgroundColor: 'var(--accent-primary)',
                              }}
                            />
                          </div>
                        </div>

                        {/* Continue Learning Button */}
                        <button
                          className="w-full py-2 rounded-lg font-semibold text-white text-sm transition-all flex items-center justify-center gap-2"
                          style={{ backgroundColor: 'var(--accent-primary)' }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--accent-dark)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--accent-primary)';
                          }}
                        >
                          Continue Learning
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Badges & Achievements
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {BADGE_DEFINITIONS.map((badge) => {
                const isEarned = userStats.badges.some(b => b.id === badge.id);
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-xl text-center cursor-pointer relative group"
                    style={{
                      backgroundColor: isEarned ? 'var(--surface)' : 'var(--bg2)',
                      border: isEarned ? `2px solid var(--accent-primary)` : `1px solid var(--border)`,
                      opacity: isEarned ? 1 : 0.6,
                    }}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      {badge.name}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {badge.description}
                    </p>

                    {/* Tooltip on hover */}
                    <div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                      style={{
                        backgroundColor: 'var(--accent-primary)',
                        color: 'white',
                      }}
                    >
                      +{badge.xp} XP
                    </div>

                    {/* Lock icon for unearned */}
                    {!isEarned && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                        <span className="text-xl">🔒</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'xp' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Level */}
              <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: 'var(--surface)', border: `1px solid var(--border)` }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Current Level
                </h3>
                <div className="flex items-end gap-4">
                  <div className="text-6xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                    {levelInfo.level}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {levelInfo.title}
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {levelInfo.currentXp}/{levelInfo.maxXpForLevel} XP
                    </p>
                  </div>
                </div>
              </div>

              {/* Total XP */}
              <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: 'var(--surface)', border: `1px solid var(--border)` }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Total XP
                </h3>
                <div className="text-5xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {userStats.totalXp}
                </div>
                <p style={{ color: 'var(--text-secondary)' }} className="mt-2">
                  Keep learning to earn more XP
                </p>
              </div>
            </div>

            {/* XP Sources */}
            <div
              className="p-6 rounded-xl"
              style={{ backgroundColor: 'var(--surface)', border: `1px solid var(--border)` }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                How to Earn XP
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'Enroll in a course', xp: '+10 XP' },
                  { action: 'Complete a lesson', xp: '+5 XP' },
                  { action: 'Complete a course', xp: '+100 XP' },
                  { action: 'Earn a badge', xp: '+25–50 XP' },
                  { action: 'Daily login streak', xp: '+5 XP/day' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{item.action}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{item.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Progression */}
            <div
              className="p-6 rounded-xl"
              style={{ backgroundColor: 'var(--surface)', border: `1px solid var(--border)` }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Level Progression
              </h3>
              <div className="space-y-3">
                {LEVEL_THRESHOLDS.map((threshold) => (
                  <div key={threshold.level} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        backgroundColor: levelInfo.level >= threshold.level ? 'var(--accent-primary)' : 'var(--bg2)',
                      }}
                    >
                      {threshold.level}
                    </div>
                    <div className="flex-1">
                      <p style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                        {threshold.title}
                      </p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {threshold.minXp}–{threshold.maxXp} XP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'certificates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Certificates
            </h2>

            {userStats.certificates.length === 0 ? (
              <div
                className="text-center py-12 rounded-xl"
                style={{ backgroundColor: 'var(--surface)', border: `1px solid var(--border)` }}
              >
                <div className="text-6xl mb-4">🎓</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  No certificates earned yet
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Complete a course to earn your first certificate
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userStats.certificates.map((cert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl border-2"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent-primary)' }}
                  >
                    <GraduationCap size={32} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {cert.course}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      Completed on {cert.date}
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-2 rounded-lg font-semibold text-white text-sm"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                      >
                        View
                      </button>
                      <button
                        className="flex-1 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--bg2)', color: 'var(--text-primary)' }}
                      >
                        <Share2 size={16} />
                        Share
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
