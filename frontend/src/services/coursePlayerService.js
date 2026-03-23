import COURSES_WITH_CONTENT from '../data/coursesData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const parseYouTubeId = (value = '') => {
  if (!value) return '';

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);
    const fromSearch = url.searchParams.get('v');
    if (fromSearch) return fromSearch;

    const parts = url.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  } catch {
    return value;
  }
};

const normalizeFallbackCourse = (course) => ({
  ...course,
  description: course.description || 'Course content',
  modules: (course.sections || []).map((section, sectionIndex) => ({
    id: String(section.id ?? sectionIndex + 1),
    title: section.title,
    order: section.order ?? sectionIndex,
    lessons: (section.lessons || []).map((lesson, lessonIndex) => ({
      id: String(lesson.id),
      title: lesson.title,
      duration: lesson.duration || '0:00',
      durationSeconds: lesson.durationSeconds || 0,
      videoId: parseYouTubeId(lesson.videoUrl || lesson.youtubeUrl || course.ytId),
      isFree: Boolean(lesson.isFree),
      order: lesson.order ?? lessonIndex,
    })),
  })),
});

const mapSupabaseCourse = (courseRow) => {
  const sections = (courseRow?.Section || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return {
    id: String(courseRow.id),
    title: courseRow.title,
    description: courseRow.description || 'Course content',
    author: courseRow.author || 'Instructor',
    modules: sections.map((section) => ({
      id: String(section.id),
      title: section.title,
      order: section.order ?? 0,
      lessons: (section.Lesson || [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((lesson) => ({
          id: String(lesson.id),
          title: lesson.title,
          duration: lesson.duration ? `${Math.floor(lesson.duration / 60)}:${String(lesson.duration % 60).padStart(2, '0')}` : '0:00',
          durationSeconds: lesson.duration || 0,
          videoId: parseYouTubeId(lesson.youtubeUrl),
          isFree: Boolean(lesson.isFree),
          order: lesson.order ?? 0,
        })),
    })),
  };
};

const fallbackCourse = (courseId) => {
  const numericId = Number(courseId);
  const course = COURSES_WITH_CONTENT.find((item) => Number(item.id) === numericId);
  return course ? normalizeFallbackCourse(course) : null;
};

export const checkEnrollment = async ({ courseId, userId }) => {
  const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
  const localEnrolled = enrolledCourses.map(String).includes(String(courseId));

  if (!isSupabaseConfigured || !userId) {
    return localEnrolled;
  }

  try {
    const { data, error } = await supabase
      .from('Enrollment')
      .select('id')
      .eq('courseId', String(courseId))
      .eq('userId', String(userId))
      .maybeSingle();

    if (error) {
      return localEnrolled;
    }

    return Boolean(data) || localEnrolled;
  } catch {
    return localEnrolled;
  }
};

export const getCourseContent = async (courseId) => {
  if (!isSupabaseConfigured) {
    return fallbackCourse(courseId);
  }

  try {
    const { data, error } = await supabase
      .from('Course')
      .select('id, title, description, Section(id, title, order, Lesson(id, title, order, youtubeUrl, duration, isFree))')
      .eq('id', String(courseId))
      .single();

    if (error || !data) {
      return fallbackCourse(courseId);
    }

    return mapSupabaseCourse(data);
  } catch {
    return fallbackCourse(courseId);
  }
};

export const getCourseProgress = async ({ course, userId }) => {
  const progressKey = `course_progress_${course.id}_${userId || 'guest'}`;
  const localProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');

  const progressByLesson = { ...localProgress };

  if (isSupabaseConfigured && userId) {
    try {
      const allLessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));

      if (allLessonIds.length > 0) {
        const { data, error } = await supabase
          .from('Progress')
          .select('lessonId, completed')
          .eq('userId', String(userId))
          .in('lessonId', allLessonIds);

        if (!error && data) {
          data.forEach((entry) => {
            progressByLesson[String(entry.lessonId)] = {
              ...(progressByLesson[String(entry.lessonId)] || {}),
              completed: Boolean(entry.completed),
            };
          });
        }
      }
    } catch {
      // Use local fallback silently.
    }
  }

  localStorage.setItem(progressKey, JSON.stringify(progressByLesson));
  return progressByLesson;
};

export const saveLessonProgress = async ({
  courseId,
  lessonId,
  userId,
  completed,
  watchSeconds,
  resumeAt,
}) => {
  const progressKey = `course_progress_${courseId}_${userId || 'guest'}`;
  const localProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');

  localProgress[String(lessonId)] = {
    ...(localProgress[String(lessonId)] || {}),
    completed: Boolean(completed),
    watchSeconds: watchSeconds ?? localProgress[String(lessonId)]?.watchSeconds ?? 0,
    resumeAt: resumeAt ?? localProgress[String(lessonId)]?.resumeAt ?? 0,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(progressKey, JSON.stringify(localProgress));

  if (isSupabaseConfigured && userId) {
    try {
      await supabase.from('Progress').upsert(
        {
          userId: String(userId),
          lessonId: String(lessonId),
          completed: Boolean(completed),
          watchedAt: new Date().toISOString(),
        },
        { onConflict: 'userId,lessonId' }
      );
    } catch {
      // Local persistence remains the fallback.
    }
  }

  return localProgress[String(lessonId)];
};
