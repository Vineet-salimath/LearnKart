import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock3,
  Lock,
  Menu,
  PlayCircle,
  X,
} from 'lucide-react';
import Certificate from '../components/certificate/Certificate';
import { useAuthStore } from '../store/authStore';
import {
  checkEnrollment,
  getCourseContent,
  getCourseProgress,
  saveLessonProgress,
} from '../services/coursePlayerService';

let youtubeApiLoader;

const loadYouTubeAPI = () => {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiLoader) {
    return youtubeApiLoader;
  }

  youtubeApiLoader = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;

    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof existingCallback === 'function') {
        existingCallback();
      }
      resolve(window.YT);
    };

    document.body.appendChild(script);
  });

  return youtubeApiLoader;
};

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState('');
  const [expandedModules, setExpandedModules] = useState({});
  const [progressByLesson, setProgressByLesson] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [watchSeconds, setWatchSeconds] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const playerHostRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const watchIntervalRef = useRef(null);
  const autoCompletedLessonRef = useRef(null);

  const allLessons = useMemo(() => {
    if (!course) return [];

    return course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        ...lesson,
        moduleId: module.id,
        moduleTitle: module.title,
      }))
    );
  }, [course]);

  const lessonIndexMap = useMemo(() => {
    const map = {};
    allLessons.forEach((lesson, index) => {
      map[lesson.id] = index;
    });
    return map;
  }, [allLessons]);

  const activeLesson = useMemo(
    () => allLessons.find((lesson) => lesson.id === activeLessonId) || allLessons[0] || null,
    [allLessons, activeLessonId]
  );

  const completedCount = useMemo(
    () => allLessons.filter((lesson) => progressByLesson[lesson.id]?.completed).length,
    [allLessons, progressByLesson]
  );

  const progressPercent = useMemo(() => {
    if (!allLessons.length) return 0;
    return Math.round((completedCount / allLessons.length) * 100);
  }, [allLessons.length, completedCount]);

  const nextLesson = useMemo(() => {
    if (!activeLesson) return null;

    const currentIndex = lessonIndexMap[activeLesson.id];
    if (typeof currentIndex !== 'number') return null;

    return allLessons[currentIndex + 1] || null;
  }, [activeLesson, allLessons, lessonIndexMap]);

  const getResumeKey = (lessonId) => `course_resume_${courseId}_${lessonId}_${user?.id || 'guest'}`;

  const isLessonLocked = (lesson) => !isEnrolled && !lesson.isFree;

  const stopWatchPolling = () => {
    if (watchIntervalRef.current) {
      clearInterval(watchIntervalRef.current);
      watchIntervalRef.current = null;
    }
  };

  const persistPlaybackState = async (lesson, options = {}) => {
    if (!lesson) return;

    const fallbackState = progressByLesson[lesson.id] || {};
    const currentSeconds = options.currentSeconds ?? fallbackState.watchSeconds ?? 0;
    const resumeAt = options.resumeAt ?? fallbackState.resumeAt ?? 0;
    const completed = Boolean(options.completed ?? fallbackState.completed ?? false);

    const updatedEntry = await saveLessonProgress({
      courseId,
      lessonId: lesson.id,
      userId: user?.id,
      completed,
      watchSeconds: Math.floor(currentSeconds),
      resumeAt: Math.floor(resumeAt),
    });

    setProgressByLesson((prev) => ({
      ...prev,
      [lesson.id]: {
        ...(prev[lesson.id] || {}),
        ...updatedEntry,
      },
    }));
  };

  const markLessonComplete = async (lesson) => {
    if (!lesson) return;

    const player = playerInstanceRef.current;
    const currentSeconds = player?.getCurrentTime ? player.getCurrentTime() : watchSeconds;

    await persistPlaybackState(lesson, {
      completed: true,
      currentSeconds,
      resumeAt: currentSeconds,
    });
  };

  const handleLessonSelect = (lesson) => {
    if (!lesson || isLessonLocked(lesson)) return;
    setActiveLessonId(lesson.id);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      setError('');

      try {
        const loadedCourse = await getCourseContent(courseId);

        if (!loadedCourse || !loadedCourse.modules?.length) {
          setError('Course content is unavailable right now.');
          setLoading(false);
          return;
        }

        const enrolled = await checkEnrollment({ courseId, userId: user?.id });
        const courseProgress = await getCourseProgress({
          course: loadedCourse,
          userId: user?.id,
        });

        setCourse(loadedCourse);
        setIsEnrolled(enrolled);
        setProgressByLesson(courseProgress);

        const moduleExpansion = {};
        loadedCourse.modules.forEach((module, index) => {
          moduleExpansion[module.id] = index === 0;
        });
        setExpandedModules(moduleExpansion);

        const unlockedLessons = loadedCourse.modules
          .flatMap((module) => module.lessons)
          .filter((lesson) => enrolled || lesson.isFree);

        const savedLessonId = localStorage.getItem(`course_last_lesson_${courseId}_${user?.id || 'guest'}`);
        const validSavedLesson = unlockedLessons.find((lesson) => lesson.id === savedLessonId);

        const firstIncomplete = unlockedLessons.find(
          (lesson) => !courseProgress[lesson.id]?.completed
        );

        const startingLesson =
          validSavedLesson || firstIncomplete || unlockedLessons[0] || loadedCourse.modules[0].lessons[0];

        setActiveLessonId(startingLesson?.id || '');
      } catch (err) {
        setError(err.message || 'Unable to load course player.');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [courseId, user?.id]);

  useEffect(() => {
    if (!activeLessonId) return;
    localStorage.setItem(
      `course_last_lesson_${courseId}_${user?.id || 'guest'}`,
      activeLessonId
    );
  }, [activeLessonId, courseId, user?.id]);

  useEffect(() => {
    if (!activeLesson || isLessonLocked(activeLesson)) {
      stopWatchPolling();
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
      return undefined;
    }

    let canceled = false;

    const setupPlayer = async () => {
      await loadYouTubeAPI();
      if (canceled || !playerHostRef.current || !window.YT?.Player) return;

      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }

      autoCompletedLessonRef.current = null;

      playerInstanceRef.current = new window.YT.Player(playerHostRef.current, {
        videoId: activeLesson.videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event) => {
            const duration = event.target.getDuration?.() || activeLesson.durationSeconds || 0;
            setVideoDuration(duration);

            const resumeState = progressByLesson[activeLesson.id] || {};
            const savedResumeAt = Number(resumeState.resumeAt || localStorage.getItem(getResumeKey(activeLesson.id)) || 0);

            if (savedResumeAt > 0 && savedResumeAt < duration - 5) {
              event.target.seekTo(savedResumeAt, true);
              setWatchSeconds(savedResumeAt);
            } else {
              setWatchSeconds(0);
            }
          },
          onStateChange: (event) => {
            const state = event.data;
            const ytStates = window.YT.PlayerState;

            if (state === ytStates.PLAYING) {
              stopWatchPolling();
              watchIntervalRef.current = setInterval(async () => {
                const player = playerInstanceRef.current;
                if (!player?.getCurrentTime) return;

                const current = player.getCurrentTime();
                const duration = player.getDuration() || activeLesson.durationSeconds || 0;

                setWatchSeconds(current);
                setVideoDuration(duration);

                if (Math.floor(current) % 5 === 0) {
                  localStorage.setItem(getResumeKey(activeLesson.id), String(Math.floor(current)));
                  await persistPlaybackState(activeLesson, {
                    currentSeconds: current,
                    resumeAt: current,
                    completed: progressByLesson[activeLesson.id]?.completed,
                  });
                }

                if (
                  duration > 0 &&
                  current / duration >= 0.92 &&
                  !progressByLesson[activeLesson.id]?.completed &&
                  autoCompletedLessonRef.current !== activeLesson.id
                ) {
                  autoCompletedLessonRef.current = activeLesson.id;
                  await markLessonComplete(activeLesson);
                }
              }, 1000);
            }

            if (state === ytStates.PAUSED) {
              stopWatchPolling();
              const player = playerInstanceRef.current;
              const current = player?.getCurrentTime ? player.getCurrentTime() : 0;
              localStorage.setItem(getResumeKey(activeLesson.id), String(Math.floor(current)));
              persistPlaybackState(activeLesson, {
                currentSeconds: current,
                resumeAt: current,
                completed: progressByLesson[activeLesson.id]?.completed,
              });
            }

            if (state === ytStates.ENDED) {
              stopWatchPolling();
              localStorage.setItem(getResumeKey(activeLesson.id), '0');
              markLessonComplete(activeLesson);
            }
          },
        },
      });
    };

    setupPlayer();

    return () => {
      canceled = true;
      stopWatchPolling();
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [activeLesson?.id, activeLesson?.videoId, isEnrolled]);

  const outlinePanel = (
    <div className="h-full bg-slate-950 border-l border-slate-800 flex flex-col">
      <div className="px-5 py-4 border-b border-slate-800">
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-400">Course Outline</p>
        <p className="text-sm text-slate-300 mt-1">{allLessons.length} lessons</p>
      </div>

      <div className="overflow-y-auto px-4 py-4 space-y-3">
        {course?.modules.map((module, moduleIndex) => (
          <div key={module.id} className="rounded-xl border border-slate-800 bg-slate-900/70">
            <button
              type="button"
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between px-3 py-3 text-left"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Module {moduleIndex + 1}</p>
                <p className="text-sm font-semibold text-slate-100 mt-1">{module.title}</p>
              </div>
              {expandedModules[module.id] ? (
                <ChevronUp size={16} className="text-slate-400" />
              ) : (
                <ChevronDown size={16} className="text-slate-400" />
              )}
            </button>

            <AnimatePresence initial={false}>
              {expandedModules[module.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="pb-2">
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLesson?.id;
                      const isCompleted = Boolean(progressByLesson[lesson.id]?.completed);
                      const locked = isLessonLocked(lesson);

                      return (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            onClick={() => handleLessonSelect(lesson)}
                            disabled={locked}
                            className={`w-full px-3 py-2.5 flex items-start gap-3 text-left transition ${
                              isActive
                                ? 'bg-sky-500/15 border-l-2 border-sky-400'
                                : 'hover:bg-slate-800/70 border-l-2 border-transparent'
                            } ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            <span className="mt-0.5 text-slate-400">
                              {locked ? (
                                <Lock size={15} />
                              ) : isCompleted ? (
                                <CheckCircle2 size={15} className="text-emerald-400" />
                              ) : (
                                <Circle size={15} className="text-slate-500" />
                              )}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span
                                className={`block text-sm truncate ${
                                  isActive ? 'text-sky-300 font-semibold' : 'text-slate-200'
                                }`}
                              >
                                {lesson.title}
                              </span>
                              <span className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1">
                                <Clock3 size={12} />
                                {lesson.duration}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center text-slate-300">
        Loading course player...
      </div>
    );
  }

  if (error || !course || !activeLesson) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center px-6">
        <div className="max-w-lg text-center">
          <p className="text-slate-200 text-lg font-semibold">Unable to open this course</p>
          <p className="text-slate-400 mt-2">{error || 'The course or lesson could not be loaded.'}</p>
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="h-16 border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-40 px-4 md:px-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label="Back to courses"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500 truncate">{course.title}</p>
          <h1 className="text-sm md:text-base font-semibold truncate">{activeLesson.title}</h1>
        </div>

        <div className="text-right mr-1">
          <p className="text-sm font-semibold text-sky-300">{progressPercent}%</p>
          <p className="text-xs text-slate-400">Complete</p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800"
          aria-label="Open course structure"
        >
          <Menu size={18} />
        </button>
      </header>

      <main className="grid lg:grid-cols-[330px_1fr] min-h-[calc(100vh-64px)]">
        <aside className="hidden lg:block border-r border-slate-800">{outlinePanel}</aside>

        <section className="min-w-0">
          <div className="bg-black aspect-video relative">
            {isLessonLocked(activeLesson) ? (
              <div className="h-full w-full grid place-items-center bg-slate-900/85">
                <div className="text-center px-6">
                  <Lock size={28} className="mx-auto text-amber-400" />
                  <h2 className="text-lg font-semibold mt-3">Enroll to access this lesson</h2>
                  <p className="text-sm text-slate-400 mt-2">This content is locked until enrollment is complete.</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/payment?courseId=${courseId}`)}
                    className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-400"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ) : (
              <div ref={playerHostRef} className="h-full w-full" />
            )}
          </div>

          <div className="px-4 md:px-6 py-6 space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                    Lesson {(lessonIndexMap[activeLesson.id] ?? 0) + 1} of {allLessons.length}
                  </p>
                  <h2 className="text-2xl font-semibold mt-2">{activeLesson.title}</h2>
                  <p className="text-slate-400 text-sm mt-2 inline-flex items-center gap-2">
                    <Clock3 size={14} />
                    Duration: {activeLesson.duration} | Watched: {Math.floor(watchSeconds)}s
                  </p>
                </div>

                <div className="text-right min-w-[180px]">
                  <p className="text-xs text-slate-500">Course Progress</p>
                  <p className="text-2xl font-bold text-sky-300 mt-1">{progressPercent}%</p>
                </div>
              </div>

              <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {completedCount} of {allLessons.length} lessons completed
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!progressByLesson[activeLesson.id]?.completed && !isLessonLocked(activeLesson) && (
                <button
                  type="button"
                  onClick={() => markLessonComplete(activeLesson)}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-400"
                >
                  <CheckCircle2 size={16} />
                  Mark Lesson Complete
                </button>
              )}

              {nextLesson && !isLessonLocked(nextLesson) && (
                <button
                  type="button"
                  onClick={() => setActiveLessonId(nextLesson.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
                >
                  <PlayCircle size={16} />
                  Next Lesson
                </button>
              )}
            </div>

            {progressPercent === 100 && (
              <button
                type="button"
                onClick={() => setShowCertificate(true)}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-3 text-sm font-semibold"
              >
                <Award size={18} />
                Download Certificate
              </button>
            )}

            {!isAuthenticated && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
                You are viewing as guest. Sign in for synced progress and enrollment access.
              </div>
            )}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/65"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <div className="h-16 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between">
                <p className="text-sm font-semibold">Full Course Structure</p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-md text-slate-300 hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>
              {outlinePanel}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <Certificate
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        course={{ ...course, title: course.title }}
        userName={user?.name || 'Student'}
        completionDate={new Date().toISOString()}
      />
    </div>
  );
};

export default CoursePlayer;
