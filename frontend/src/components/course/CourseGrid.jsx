import { Grid, List } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { cn } from '../../utils/helpers';

export function CourseGrid({ courses, viewMode = 'grid', onViewModeChange, loading = false }) {
  if (loading) {
    return (
      <div className={cn(
        'grid gap-6',
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      )}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-medium text-muted">No courses found</p>
          <p className="text-sm text-muted">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View mode toggle */}
      {onViewModeChange && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing <span className="font-semibold text-text">{courses.length}</span> courses
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Course grid/list */}
      <div className={cn(
        'grid gap-6',
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      )}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} variant={viewMode} />
        ))}
      </div>
    </div>
  );
}
