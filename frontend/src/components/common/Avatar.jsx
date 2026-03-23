import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Avatar = forwardRef(({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent  text-white font-semibold',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span>{getInitials(fallback || alt || 'User')}</span>
      )}
    </div>
  );
});
Avatar.displayName = 'Avatar';

export { Avatar };
