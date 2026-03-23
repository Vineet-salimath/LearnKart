import { CheckCircle, Lock, PlayCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function LessonList({
  sections,
  currentLessonId,
  completedLessonIds = [],
  isEnrolled = false,
  onLessonClick,
  className
}) {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const isLessonAccessible = (lesson) => {
    return isEnrolled || lesson.isFree;
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessonIds.includes(lessonId);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {sections && sections.length > 0 ? (
        sections.map((section) => (
          <div key={section.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Section Header */}
            <div className="bg-gray-50 p-4">
              <h3 className="font-semibold text-text">{section.title}</h3>
              <p className="mt-1 text-sm text-muted">
                {section.lessons?.length || 0} lessons
              </p>
            </div>

            {/* Lessons */}
            <div className="divide-y divide-gray-100">
              {section.lessons && section.lessons.length > 0 ? (
                section.lessons.map((lesson) => {
                  const isAccessible = isLessonAccessible(lesson);
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isCurrent = lesson.id === currentLessonId;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => isAccessible && onLessonClick && onLessonClick(lesson)}
                      disabled={!isAccessible}
                      className={cn(
                        'flex w-full items-center gap-3 p-4 text-left transition-colors',
                        isAccessible && 'hover:bg-gray-50 cursor-pointer',
                        !isAccessible && 'cursor-not-allowed opacity-60',
                        isCurrent && 'bg-primary/5 border-l-4 border-primary'
                      )}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {!isAccessible ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                            <Lock className="h-4 w-4 text-gray-500" />
                          </div>
                        ) : isCompleted ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <PlayCircle className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'font-medium line-clamp-2',
                          isCurrent ? 'text-primary' : 'text-text'
                        )}>
                          {lesson.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(lesson.duration)}</span>
                          {lesson.isFree && (
                            <span className="rounded bg-green-100 px-2 py-0.5 text-green-700 font-medium">
                              Free
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Current indicator */}
                      {isCurrent && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-sm text-muted">
                  No lessons in this section
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-muted">No sections available</p>
        </div>
      )}
    </div>
  );
}
