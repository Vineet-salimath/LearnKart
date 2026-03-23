import { cn } from '../../utils/helpers';

export function ProgressBar({ progress = 0, showLabel = true, size = 'md', className }) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-text">Course Progress</span>
          <span className="font-semibold text-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn(
        'relative w-full overflow-hidden rounded-full bg-gray-200',
        sizeClasses[size]
      )}>
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
