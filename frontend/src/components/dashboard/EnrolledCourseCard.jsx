import { Link } from 'react-router-dom';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ProgressBar } from '../player/ProgressBar';
import { cn } from '../../utils/helpers';

export function EnrolledCourseCard({ enrollment, className }) {
  const { course, progress = 0, lastWatchedLesson } = enrollment;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}+ hours`;
  };

  const isCompleted = progress >= 100;

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg', className)}>
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="aspect-video w-full object-cover"
        />
        {isCompleted && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            <CheckCircle className="h-3 w-3" />
            Completed
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-text line-clamp-2 hover:text-primary font-heading">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-muted">by {course.instructor?.name}</p>
        </div>

        <ProgressBar progress={progress} showLabel={true} size="sm" />

        <div className="flex items-center justify-between text-sm text-muted">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(course.totalDuration)}</span>
          </div>
          <span>{Math.round(progress)}% Complete</span>
        </div>

        <Link to={`/learn/${course.id}/${lastWatchedLesson?.id || ''}`}>
          <Button className="w-full" variant={isCompleted ? 'outline' : 'primary'}>
            <PlayCircle className="mr-2 h-4 w-4" />
            {isCompleted ? 'Review Course' : 'Continue Learning'}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
