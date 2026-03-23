import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Users,
  BookOpen,
  Globe,
  Play,
  Star,
  Award,
  Zap,
  CheckCircle,
  TrendingUp,
  Code,
  Palette,
  Database,
  Smartphone,
  Brain,
  Camera,
  BarChart3,
  Lightbulb,
  Users2,
  ChevronRight,
  ChevronLeft,
  Mail,
  Send
} from 'lucide-react';
import { Loader } from '../components/common/Loader';

// CountUp component for animated numbers
const CountUp = ({ target, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = target / (duration * 60);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isVisible, target, duration]);

  return <span ref={ref}>{count}</span>;
};

// Typewriter effect component
const Typewriter = ({ texts = ['Without Limits', 'For Your Career', 'With Experts'] }) => {
  const [currentText, setCurrentText] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const text = texts[currentText];
      if (!isDeleting) {
        if (displayText.length < text.length) {
          setDisplayText(text.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentText((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentText, texts]);

  return (
    <span className="gradient-text font-bold">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Testimonials Carousel
const TestimonialsCarousel = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative h-96 overflow-hidden">
      <motion.div
        key={current}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.5 },
        }}
        className="absolute inset-0"
      >
        <div className="h-full flex items-center justify-center px-8">
          <div className="bg-gradient-to-br from-[#0d0f1c] to-[#1a1d2e] rounded-3xl p-12 border border-purple-500/20 glassmorphism-dark max-w-2xl mx-auto">
            <div className="flex items-center gap-1 mb-6">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white text-xl mb-8 leading-relaxed">
              "{testimonials[current].content}"
            </p>
            <div className="flex items-center gap-4">
              <img
                src={testimonials[current].avatar}
                alt={testimonials[current].name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-white font-semibold text-lg">{testimonials[current].name}</h4>
                <p className="text-purple-300">{testimonials[current].role}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation buttons */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-all duration-300 group hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-all duration-300 group hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > current ? 1 : -1);
              setCurrent(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-purple-500 w-8' : 'bg-purple-300 w-2 hover:bg-purple-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Scroll-triggered animation wrapper
const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Mock courses data
        const mockCourses = [
          {
            id: 1,
            title: 'Advanced Web Development with React',
            category: 'Web Development',
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd2fa3f635?w=500&h=300&fit=crop',
            instructor: { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop' },
            price: 4999,
            rating: 4.9,
            students: '12K',
          },
          {
            id: 2,
            title: 'UI/UX Design Masterclass',
            category: 'Design',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
            instructor: { name: 'Sarah Williams', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop' },
            price: 3999,
            rating: 4.8,
            students: '8K',
          },
          {
            id: 3,
            title: 'Data Science & Machine Learning',
            category: 'Data Science',
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd2fa3f635?w=500&h=300&fit=crop',
            instructor: { name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop' },
            price: 5999,
            rating: 4.9,
            students: '15K',
          },
        ];
        setCourses(mockCourses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const stats = [
    { value: '50', suffix: 'K+', label: 'Active Students', icon: Users },
    { value: '4.8', suffix: '/5', label: 'Average Rating', icon: Star },
    { value: '200', suffix: '+', label: 'Expert Courses', icon: BookOpen },
    { value: '150', suffix: '+', label: 'Countries', icon: Globe },
  ];

  const categories = [
    { name: 'Web Development', icon: Code, color: 'from-blue-500 to-blue-600', courses: '45+' },
    { name: 'UI/UX Design', icon: Palette, color: 'from-purple-500 to-purple-600', courses: '30+' },
    { name: 'Data Science', icon: Database, color: 'from-green-500 to-green-600', courses: '25+' },
    { name: 'Mobile Dev', icon: Smartphone, color: 'from-white to-slate-200', courses: '20+' },
    { name: 'AI & ML', icon: Brain, color: 'from-red-500 to-red-600', courses: '18+' },
    { name: 'Photography', icon: Camera, color: 'from-indigo-500 to-indigo-600', courses: '15+' },
  ];

  const features = [
    {
      title: 'Learn at Your Own Pace',
      description: 'Access courses anytime, anywhere with lifetime access to all materials. No deadlines, no pressure.',
      icon: Play,
      image: 'https://images.unsplash.com/photo-1516534775068-bb57dba3df21?w=500&h=400&fit=crop',
      benefits: ['Lifetime access', 'Download materials', '24/7 support'],
    },
    {
      title: 'Industry Expert Instructors',
      description: 'Learn directly from professionals working at top tech companies with real-world experience.',
      icon: Award,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
      benefits: ['Expert-led courses', 'Real-world projects', 'Career guidance'],
    },
    {
      title: 'Recognized Certifications',
      description: 'Earn industry-recognized certificates to showcase your skills to potential employers.',
      icon: Award,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=400&fit=crop',
      benefits: ['LinkedIn shareable', 'Verified credentials', 'Career boost'],
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer at Google',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop',
      content: 'LearnKart transformed my career completely. The structured learning path and expert instructors made all the difference in landing my role at Google.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager at Microsoft',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop',
      content: 'The practical projects and real-world case studies gave me hands-on experience that was invaluable in my interview process.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer at Airbnb',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop',
      content: 'Best investment I made for my professional development. The community support and instructor feedback were exceptional.',
      rating: 5,
    },
  ];

  const companyLogos = [
    { name: 'Google', logo: '🔵' },
    { name: 'Meta', logo: '🟦' },
    { name: 'Netflix', logo: '🔴' },
    { name: 'Airbnb', logo: '🟥' },
    { name: 'Tesla', logo: '⚪' },
    { name: 'Amazon', logo: '🟠' },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribeLoading(true);
    setTimeout(() => {
      setEmail('');
      setSubscribeLoading(false);
    }, 1500);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#0d0f1c] overflow-hidden pt-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full filter blur-3xl opacity-20"
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{
              duration: 8,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute top-40 right-0 w-80 h-80 bg-gradient-to-l from-blue-500 to-purple-600 rounded-full filter blur-3xl opacity-20"
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 30, -30, 0],
            }}
            transition={{
              duration: 8,
              delay: 1,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  <span className="block">Learn</span>
                  <Typewriter texts={['Without Limits', 'For Your Career', 'With Experts']} />
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-300 leading-relaxed max-w-lg"
              >
                Master in-demand skills with world-class instructors. Transform your career with practical, hands-on learning designed for the real world.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/courses"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    Explore Courses
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <button
                  className="group inline-flex items-center justify-center px-8 py-4 border border-purple-400/50 text-white font-semibold rounded-xl hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 glassmorphism"
                >
                  <span className="flex items-center gap-2">
                    Watch Demo
                    <Play className="h-4 w-4" />
                  </span>
                </button>
              </motion.div>

              {/* Stats Pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-6 text-white/80 pt-8"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>50K+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span>200+ Courses</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative h-96">
                {/* Web Development Card */}
                <motion.div
                  className="absolute top-0 right-0 w-64 p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-2xl border border-purple-400/20 glassmorphism-dark backdrop-blur-xl cursor-pointer group hover:border-purple-400/50 transition-all duration-300"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                  whileHover={{ scale: 1.05, y: -30 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                      <Code className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Web Dev</h4>
                      <p className="text-sm text-purple-300">45+ Courses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9 (12K)</span>
                  </div>
                </motion.div>

                {/* UI/UX Design Card */}
                <motion.div
                  className="absolute top-32 left-0 w-72 p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-2xl border border-purple-400/20 glassmorphism-dark backdrop-blur-xl cursor-pointer group hover:border-purple-400/50 transition-all duration-300"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
                  whileHover={{ scale: 1.05, y: -25 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                      <Palette className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">UI/UX Design</h4>
                      <p className="text-sm text-purple-300">Premium</p>
                    </div>
                  </div>
                  <p className="text-white/60 text-xs mb-3">Learn modern design principles</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">₹3,999</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </motion.div>

                {/* Data Science Card */}
                <motion.div
                  className="absolute bottom-0 right-12 w-60 p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-2xl border border-purple-400/20 glassmorphism-dark backdrop-blur-xl cursor-pointer group hover:border-purple-400/50 transition-all duration-300"
                  animate={{ y: [0, -18, 0] }}
                  transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, delay: 2 }}
                  whileHover={{ scale: 1.05, y: -28 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Data Science</h4>
                      <p className="text-sm text-purple-300">Trending</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <TrendingUp className="h-3 w-3" />
                    <span>95% job placement</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-purple-400 rounded-full mt-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Social Proof Bar */}
      <motion.section
        className="bg-gradient-to-r from-[#0d0f1c] to-[#1a1d2e] border-y border-purple-500/10 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider">
              Trusted by professionals from leading companies
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companyLogos.map((company, idx) => (
              <motion.div
                key={idx}
                className="text-center text-4xl cursor-pointer hover:scale-110 transition-transform duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-gray-400 hover:text-purple-300 transition-colors">
                  {company.logo}
                </span>
                <p className="text-xs text-gray-500 mt-2">{company.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section with CountUp */}
      <section className="bg-[#0d0f1c] py-20 border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-white">
                      <div className="text-4xl font-bold">
                        <CountUp target={parseInt(stat.value)} duration={2} />
                        <span className="text-2xl text-purple-400">{stat.suffix}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Sections with Alternating Layout */}
      <section className="bg-[#0d0f1c] py-20 border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isEven = idx % 2 === 0;

            return (
              <ScrollReveal key={idx} delay={0.1}>
                <motion.div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 ${
                    !isEven ? 'lg:grid-flow-col-dense' : ''
                  }`}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {/* Image */}
                  <motion.div
                    className={isEven ? 'lg:col-span-1' : 'lg:col-span-1 lg:order-2'}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 group">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1c] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className={isEven ? 'lg:col-span-1' : 'lg:col-span-1 lg:order-1'}>
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl mb-6 group-hover:shadow-lg transition-all">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">{feature.title}</h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">{feature.description}</p>

                    <div className="space-y-3 mb-8">
                      {feature.benefits.map((benefit, benefitIdx) => (
                        <motion.div
                          key={benefitIdx}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: benefitIdx * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                          <span className="text-gray-300">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>

                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors group"
                    >
                      Learn more
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="bg-[#0d0f1c] py-20 border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Explore Popular Categories
              </h2>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                Discover courses across various domains and find the perfect skill to advance your career
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 0.05}>
                  <motion.div
                    className="group cursor-pointer"
                    whileHover={{ y: -10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="h-full bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-2xl p-6 border border-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-xl group-hover:shadow-purple-500/20 transition-all duration-300 text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-current/50`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{category.courses} courses</p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-[#0d0f1c] py-20 border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Featured Courses
              </h2>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                Hand-picked courses from our top instructors to help you master the most in-demand skills
              </p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {courses.map((course, idx) => (
                  <ScrollReveal key={course.id} delay={idx * 0.1}>
                    <motion.div
                      className="group h-full bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
                      whileHover={{ y: -8 }}
                    >
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                            {course.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col h-full">
                        <h3 className="font-bold text-lg text-white mb-3 line-clamp-2 group-hover:gradient-text transition-all">
                          {course.title}
                        </h3>

                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-400">{course.instructor.name}</span>
                        </div>

                        <div className="flex items-center gap-1 mb-6">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-300">
                            {course.rating} ({course.students} students)
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-2xl font-bold gradient-text">₹{course.price}</span>
                          <Link
                            to="/courses"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium group-hover:shadow-lg group-hover:shadow-purple-500/50"
                          >
                            View
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group hover:scale-105"
                >
                  Explore All Courses
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="bg-[#0d0f1c] py-20 border-b border-purple-500/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What Our Students Say
              </h2>
              <p className="text-gray-400 text-xl">
                Join thousands of satisfied learners who have transformed their careers
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <TestimonialsCarousel testimonials={testimonials} />
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing/CTA Banner */}
      <section className="relative bg-[#0d0f1c] py-20 border-b border-purple-500/10 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          style={{
            backgroundImage:
              'linear-gradient(-45deg, transparent 25%, rgba(124, 58, 237, 0.1) 25%, rgba(124, 58, 237, 0.1) 50%, transparent 50%, transparent 75%, rgba(59, 130, 246, 0.1) 75%, rgba(59, 130, 246, 0.1))',
            backgroundSize: '400% 400%',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Transform Your Career?
            </h2>
            <p className="text-gray-300 text-xl mb-12 leading-relaxed">
              Join over 50,000 students already building their future with LearnKart. Start your learning journey with our world-class courses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Start Learning Today
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <button
                className="group inline-flex items-center justify-center px-8 py-4 border border-purple-400/50 text-white font-semibold rounded-xl hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Learn More
                  <Lightbulb className="h-5 w-5" />
                </span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#0d0f1c] py-16 border-b border-purple-500/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                Stay Updated with Our Latest Courses
              </h3>
              <p className="text-gray-400 mb-8">
                Get exclusive tips, updates, and course launches directly in your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-3 bg-white/5 border border-purple-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={subscribeLoading}
                  className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    {subscribeLoading ? 'Subscribing...' : <>Subscribe <Send className="h-4 w-4" /></>}
                  </span>
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
