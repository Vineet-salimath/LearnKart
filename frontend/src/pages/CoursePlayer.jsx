import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from 'lucide-react';

//All courses data with sections
const ALL_COURSES = [
  {
    id: 1,
    title: 'React Full Course',
    author: 'Traversy Media',
    cat: 'React/Next/TS',
    lvl: 'Beginner',
    price: 199,
    rating: 4.8,
    students: '32K',
    ytId: 'bMknfKXIFA8',
    sections: [
      {
        id: 1,
        title: 'Introduction',
        lessons: [
          { id: 1, title: 'What is React?', duration: '5:23', videoUrl: 'bMknfKXIFA8', completed: false },
          { id: 2, title: 'Setting up Environment', duration: '10:15', videoUrl: 'bMknfKXIFA8', completed: false },
        ]
      },
      {
        id: 2,
        title: 'React Fundamentals',
        lessons: [
          { id: 3, title: 'Components & JSX', duration: '15:42', videoUrl: 'bMknfKXIFA8', completed: false },
          { id: 4, title: 'Props & State', duration: '12:30', videoUrl: 'bMknfKXIFA8', completed: false },
          { id: 5, title: 'Hooks Introduction', duration: '18:20', videoUrl: 'bMknfKXIFA8', completed: false },
        ]
      },
      {
        id: 3,
        title: 'Advanced Concepts',
        lessons: [
          { id: 6, title: 'Context API', duration: '14:55', videoUrl: 'bMknfKXIFA8', completed: false },
          { id: 7, title: 'Custom Hooks', duration: '16:10', videoUrl: 'bMknfKXIFA8', completed: false },
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Next.js Full Course',
    author: 'Vercel Team',
    cat: 'React/Next/TS',
    lvl: 'Intermediate',
    price: 299,
    rating: 4.7,
    students: '18K',
    ytId: 'wm5gMKuwSYk',
    sections: [
      {
        id: 1,
        title: 'Getting Started',
        lessons: [
          { id: 1, title: 'Introduction to Next.js', duration: '8:15', videoUrl: 'wm5gMKuwSYk', completed: false },
          { id: 2, title: 'Pages & Routing', duration: '12:30', videoUrl: 'wm5gMKuwSYk', completed: false },
        ]
      }
    ]
  },
];

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Check enrollment
  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const isEnrolled = enrolledCourses.includes(parseInt(courseId));

    if (!isEnrolled) {
      navigate('/courses');
      return;
    }

    const foundCourse = ALL_COURSES.find(c => c.id === parseInt(courseId));
    if (foundCourse) {
      // Load progress from localStorage
      const savedProgress = JSON.parse(localStorage.getItem(`course_${courseId}_progress`) || '{}');

      // Merge saved completion status
      const updatedCourse = {
        ...foundCourse,
        sections: foundCourse.sections.map(section => ({
          ...section,
          lessons: section.lessons.map(lesson => ({
            ...lesson,
            completed: savedProgress[lesson.id] || false
          }))
        }))
      };

      setCourse(updatedCourse);
      setCurrentLesson(updatedCourse.sections[0].lessons[0]);
      setExpandedSections({ 1: true }); // Expand first section
    }
  }, [courseId, navigate]);

  const selectLesson = (lesson) => {
    setCurrentLesson(lesson);
  };

  const markLessonComplete = () => {
    if (!currentLesson || !course) return;

    // Update local state
    const updatedCourse = {
      ...course,
      sections: course.sections.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson =>
          lesson.id === currentLesson.id ? { ...lesson, completed: true } : lesson
        )
      }))
    };
    setCourse(updatedCourse);

    // Save to localStorage
    const progress = {};
    updatedCourse.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        if (lesson.completed) {
          progress[lesson.id] = true;
        }
      });
    });
    localStorage.setItem(`course_${courseId}_progress`, JSON.stringify(progress));

    // Award XP
    const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    userStats.totalXp = (userStats.totalXp || 0) + 5;
    localStorage.setItem('userStats', JSON.stringify(userStats));
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const calculateCompletionPercent = () => {
    if (!course) return 0;
    let total = 0;
    let completed = 0;
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        total++;
        if (lesson.completed) completed++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (!course || !currentLesson) {
    return (
      <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-primary)' }}>Loading...</p>
      </div>
    );
  }

  const completionPercent = calculateCompletionPercent();

  return (
    <div className="player-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', height: '100vh', backgroundColor: '#0a0a0a' }}>
      {/* Left: Video + Content */}
      <div className="player-main" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Video Player */}
        <div
          className="video-wrapper"
          style={{ position: 'relative', backgroundColor: '#000', aspectRatio: '16/9', width: '100%' }}
        >
          {/* YouTube Embed */}
          <iframe
            src={`https://www.youtube.com/embed/${currentLesson.videoUrl}?rel=0&modestbranding=1`}
            title={currentLesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>

        {/* Lesson Info */}
        <div className="lesson-info" style={{ padding: '24px', backgroundColor: '#111', color: '#fff', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <button
                onClick={() => navigate('/courses')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}
              >
                <ArrowLeft size={16} />
                Back to Courses
              </button>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>{currentLesson.title}</h2>
              <p style={{ fontSize: '14px', color: '#aaa' }}>{course.author} · {course.title}</p>
            </div>
            {!currentLesson.completed && (
              <button
                onClick={markLessonComplete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'var(--accent-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <CheckCircle size={18} />
                Mark as Complete
              </button>
            )}
          </div>

          {/* Progress */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Course Progress</span>
              <span style={{ fontSize: '14px', color: '#aaa' }}>{completionPercent}% complete</span>
            </div>
            <div className="course-progress-bar" style={{ height: '8px', backgroundColor: '#222', borderRadius: '4px', overflow: 'hidden' }}>
              <div className="bar-fill" style={{ width: `${completionPercent}%`, height: '100%', backgroundColor: 'var(--accent-primary)', transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Curriculum Sidebar */}
      <div className="curriculum-sidebar" style={{ backgroundColor: '#111', borderLeft: '1px solid #222', overflowY: 'auto' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #222' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Course Content</h3>
          <p style={{ fontSize: '13px', color: '#666' }}>
            {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} lessons
          </p>
        </div>

        {course.sections.map((section) => (
          <div key={section.id} className="section">
            <div
              className="section-header"
              onClick={() => toggleSection(section.id)}
              style={{
                padding: '14px 16px',
                backgroundColor: '#1a1a1a',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ccc',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #222',
              }}
            >
              <span>{section.title}</span>
              {expandedSections[section.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {expandedSections[section.id] && section.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`lesson-item ${lesson.id === currentLesson.id ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                onClick={() => selectLesson(lesson)}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #1a1a1a',
                  transition: 'background 0.15s',
                  backgroundColor: lesson.id === currentLesson.id ? 'rgba(167,139,250,0.15)' : 'transparent',
                  borderLeft: lesson.id === currentLesson.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (lesson.id !== currentLesson.id) {
                    e.currentTarget.style.backgroundColor = 'rgba(167,139,250,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (lesson.id !== currentLesson.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span className="lesson-icon" style={{ flexShrink: 0, fontSize: '16px' }}>
                  {lesson.completed ? '✅' : lesson.id === currentLesson.id ? '▶️' : '⭕'}
                </span>
                <div style={{ flex: 1 }}>
                  <p className="lesson-name" style={{ fontSize: '13px', color: lesson.completed ? '#666' : '#ccc', marginBottom: '4px', fontWeight: lesson.id === currentLesson.id ? '600' : '400' }}>
                    {lesson.title}
                  </p>
                  <span className="lesson-duration" style={{ fontSize: '11px', color: '#555' }}>{lesson.duration}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePlayer;
