import { Star, Clock, BookOpen, Award } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { cn } from '../../utils/helpers';

export function CourseBanner({ course, variant = 'detail' }) {
  const {
    title,
    thumbnail,
    category,
    level,
    instructor,
    totalDuration,
    description,
  } = course;

  // Mock data
  const rating = 4.5;
  const reviewCount = 1234;
  const enrolledCount = 5678;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}+ hours`;
  };

  if (variant === 'hero') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <img src={thumbnail} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="primary">{category}</Badge>
                <Badge variant="outline">{level}</Badge>
              </div>
              <h1 className="text-4xl font-bold leading-tight lg:text-5xl font-heading">
                {title}
              </h1>
              <p className="text-lg text-gray-300 line-clamp-3">
                {description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-gray-400">
                    ({reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <BookOpen className="h-5 w-5" />
                  <span>{enrolledCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock className="h-5 w-5" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-700 pt-4">
                <Avatar
                  src={instructor?.avatar}
                  alt={instructor?.name}
                  size="lg"
                  fallback={instructor?.name}
                />
                <div>
                  <p className="text-sm text-gray-400">Created by</p>
                  <p className="font-semibold">{instructor?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={thumbnail}
                alt={title}
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant for other uses
  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent p-6 text-white">
      <div className="flex items-center gap-6">
        <img
          src={thumbnail}
          alt={title}
          className="h-24 w-24 rounded-lg object-cover shadow-lg"
        />
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold font-heading">{title}</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-white" />
              <span>{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{enrolledCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
