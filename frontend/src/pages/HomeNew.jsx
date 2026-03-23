import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  BookOpen,
  Award,
  Clock,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';

const COURSES = [
  {
    id: 1,
    title: 'React Full Course',
    author: 'Traversy Media',
    cat: 'React/Next/TS',
    lvl: 'Beginner',
    rating: 4.8,
    students: '32K',
    ytId: 'bMknfKXIFA8',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Next.js Full Course',
    author: 'Vercel Team',
    cat: 'React/Next/TS',
    lvl: 'Intermediate',
    rating: 4.7,
    students: '18K',
    ytId: 'wm5gMKuwSYk',
    thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'TypeScript Course',
    author: 'Matt Pocock',
    cat: 'React/Next/TS',
    lvl: 'Intermediate',
    rating: 4.6,
    students: '14K',
    ytId: '30LWjhZzg50',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'JavaScript Full Course',
    author: 'FreeCodeCamp',
    cat: 'JavaScript',
    lvl: 'Beginner',
    rating: 4.9,
    students: '95K',
    ytId: 'PkZNo7MFNFg',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Advanced JavaScript',
    author: 'Akshay Saini',
    cat: 'JavaScript',
    lvl: 'Advanced',
    rating: 4.9,
    students: '41K',
    ytId: 'KGkiIBTq0y0',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Docker Full Course',
    author: 'TechWorld Nina',
    cat: 'DevOps',
    lvl: 'Beginner',
    rating: 4.7,
    students: '33K',
    ytId: 'fqMOX6JJhGo',
    thumbnail: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
  },
];

const HERO_WORDS = ['Expert-Led', 'Project-Driven', 'Career-Focused', 'Hands-On'];

const FEATURE_ITEMS = [
  { icon: BookOpen, title: 'Structured content', text: 'Clear learning paths built for fast progress.' },
  { icon: Award, title: 'Certificates included', text: 'Show verified outcomes after completion.' },
  { icon: Clock, title: 'Lifetime access', text: 'Return anytime and keep learning.' },
  { icon: Target, title: 'Real-world focus', text: 'Practical skills, not filler content.' },
];

const HomeNew = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { ToastContainer } = useToast();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_WORDS.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  const featuredCourse = COURSES[0];

  const handlePreview = (course) => {
    if (isAuthenticated) {
      navigate(`/learn/${course.id}`);
      return;
    }

    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      <section className="relative overflow-hidden px-4 py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -18, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 left-8 h-72 w-72 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.32) 0%, rgba(124,58,237,0) 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -28, 0], y: [0, 22, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-0 top-20 h-80 w-80 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0) 70%)' }}
          />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -36, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="space-y-6"
            >
              <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-6xl" style={{ color: 'var(--text-primary)' }}>
                <span className="block">Master Skills with</span>
                <motion.span
                  key={HERO_WORDS[heroIndex]}
                  initial={{ opacity: 0, y: 18, scale: 0.98, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.35 }}
                  className="mt-2 inline-block bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #c084fc 0%, #8b5cf6 35%, #22c55e 100%)' }}
                >
                  {HERO_WORDS[heroIndex]}
                </motion.span>
                <span className="block">Courses</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed md:text-xl" style={{ color: 'var(--text-secondary)' }}>
                Learn from industry professionals and transform your career with hands-on projects, real-world examples, and lifetime access to premium content.
              </p>

              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-semibold text-white transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', boxShadow: '0 18px 40px rgba(124,58,237,0.35)' }}
                >
                  Explore Courses
                  <ArrowRight size={20} />
                </Link>

                <button
                  onClick={() => handlePreview(featuredCourse)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border px-8 py-4 font-semibold transition-all duration-200"
                  style={{
                    color: 'var(--text-primary)',
                    borderColor: 'rgba(168,85,247,0.28)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <Play size={20} />
                  Watch Preview
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
                {FEATURE_ITEMS.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.07 }}
                      className="rounded-2xl border p-4"
                      style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'rgba(124,58,237,0.12)' }}>
                          <Icon size={18} style={{ color: 'var(--accent-primary)' }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {item.title}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 38, rotate: 4 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: 'easeOut' }}
              className="relative lg:pl-8"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-3 top-16 hidden h-24 w-24 rounded-full blur-3xl lg:block"
                style={{ backgroundColor: 'rgba(34,197,94,0.18)' }}
              />

              <div
                className="relative overflow-hidden rounded-[2rem] border"
                style={{
                  background: 'linear-gradient(145deg, rgba(12, 16, 30, 0.92), rgba(6, 10, 20, 0.98))',
                  boxShadow: '0 30px 90px rgba(7, 7, 15, 0.6)',
                  borderColor: 'rgba(148,163,184,0.16)',
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_30%)]" />

                <div className="relative p-5 sm:p-6">
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
                    <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                      <img
                        src={featuredCourse.thumbnail}
                        alt={featuredCourse.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

                      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-md">
                        Live mentorship session
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex h-18 w-18 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white shadow-2xl backdrop-blur-md"
                          aria-label="Play course preview"
                          onClick={() => handlePreview(featuredCourse)}
                        >
                          <Play className="ml-1 h-7 w-7" />
                        </motion.button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                              Featured Course
                            </p>
                            <h3 className="mt-2 max-w-[16rem] text-2xl font-bold leading-tight text-white sm:text-3xl">
                              {featuredCourse.title}
                            </h3>
                            <p className="mt-2 text-sm text-white/70">
                              By {featuredCourse.author}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right backdrop-blur-md">
                            <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                              Rating
                            </p>
                            <p className="mt-1 text-2xl font-bold text-white">
                              {featuredCourse.rating}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3">
                          {[
                            { label: 'Students', value: featuredCourse.students },
                            { label: 'Level', value: featuredCourse.lvl },
                            { label: 'Format', value: 'Self-paced' },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-xl border border-white/10 bg-black/25 px-3 py-3 backdrop-blur-md"
                            >
                              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                                {item.label}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-white/60">
                            <span>Course completion</span>
                            <span>67%</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[67%] rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      { title: 'Expert instructors', detail: 'Hands-on guidance from industry leaders', accent: 'var(--accent-primary)' },
                      { title: 'Real outcomes', detail: 'Structured paths that lead to job-ready skills', accent: '#22c55e' },
                    ].map((card, index) => (
                      <motion.div
                        key={card.title}
                        animate={{ y: [0, -6, 0], rotate: index === 0 ? [0, 0.35, 0] : [0, -0.35, 0] }}
                        transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
                        className="rounded-2xl border p-4"
                        style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {card.title}
                          </p>
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: card.accent }} />
                        </div>
                        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {card.detail}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t px-4 py-20" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--accent-primary)' }}>
                Why LearnKart
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl" style={{ color: 'var(--text-primary)' }}>
                Built for serious learning, not filler content.
              </h2>
            </div>
            <div className="hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium md:flex" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <CheckCircle size={16} style={{ color: '#22c55e' }} />
              Professional, structured, and current
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Practical curriculum', text: 'Projects and exercises that map to real work.' },
              { title: 'Clear progression', text: 'Beginner to advanced without chaotic jumps.' },
              { title: 'Always accessible', text: 'Learn on your schedule with lifetime access.' },
              { title: 'Career support', text: 'Mentorship, confidence, and portfolio-ready outcomes.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(124,58,237,0.12)' }}>
                  <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t px-4 py-20" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--accent-primary)' }}>
                Featured courses
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl" style={{ color: 'var(--text-primary)' }}>
                Professional tracks that feel current and credible.
              </h2>
            </div>
            <Link to="/courses" className="hidden items-center gap-2 text-sm font-semibold md:inline-flex" style={{ color: 'var(--accent-primary)' }}>
              Browse all courses
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {COURSES.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -6 }}
                className="overflow-hidden rounded-3xl border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {course.cat}
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/45 px-3 py-1 text-sm font-semibold text-white backdrop-blur-md">
                    <Star size={14} fill="#fbbf24" className="text-yellow-400" />
                    {course.rating}
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {course.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      By {course.author}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span>{course.students} students</span>
                    <span>{course.lvl}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePreview(course)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-white transition-transform hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
                  >
                    <Play size={18} />
                    {isAuthenticated ? 'Go to Course' : 'Enroll Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
};

export default HomeNew;
