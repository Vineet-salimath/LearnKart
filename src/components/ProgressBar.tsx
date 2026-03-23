interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({ 
  progress, 
  className = '', 
  showLabel = true, 
  size = 'md' 
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className={`font-medium text-gray-700 ${textSizeClasses[size]}`}>
            Progress
          </span>
        )}
        {showLabel && (
          <span className={`text-gray-600 ${textSizeClasses[size]}`}>
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out ${sizeClasses[size]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}