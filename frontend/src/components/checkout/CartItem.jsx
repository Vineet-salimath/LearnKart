import { Trash2, Star, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { cn } from '../../utils/helpers';

export function CartItem({ course, onRemove, className }) {
  const {
    title,
    thumbnail,
    instructor,
    price,
    discountPrice,
    totalDuration,
  } = course;

  const rating = 4.5;
  const reviewCount = 1234;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}+ hours`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const finalPrice = discountPrice || price;

  return (
    <div className={cn(
      'flex gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md',
      className
    )}>
      {/* Thumbnail */}
      <img
        src={thumbnail}
        alt={title}
        className="h-24 w-40 flex-shrink-0 rounded-md object-cover"
      />

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold text-text line-clamp-2 hover:text-primary">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <Avatar
              src={instructor?.avatar}
              alt={instructor?.name}
              size="sm"
              fallback={instructor?.name}
            />
            <span className="text-sm text-muted">{instructor?.name}</span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
              <span>({reviewCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove && onRemove(course.id)}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          aria-label="Remove from cart"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="text-right">
          {discountPrice && (
            <p className="text-sm text-muted line-through">
              {formatPrice(price)}
            </p>
          )}
          <p className="text-xl font-bold text-primary font-heading">
            {formatPrice(finalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
