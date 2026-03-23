import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ShoppingCart, Zap, Play } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { VideoPreview } from './VideoPreview';
import { useCheckoutStore } from '../../store/checkoutStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/helpers';

export function CourseCard({ course, variant = 'grid' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const { openCheckout } = useCheckoutStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const {
    slug,
    id,
    title,
    thumbnail,
    price,
    discountPrice,
    category,
    level,
    instructor,
    totalDuration,
  } = course;

  // Mock rating data (would come from API in production)
  const rating = 4.5;
  const reviewCount = 1234;
  const enrolledCount = 5678;

  // Video preview hover delay (Netflix-style)
  useEffect(() => {
    let hoverTimer;

    if (isHovered) {
      hoverTimer = setTimeout(() => {
        setShowVideoPreview(true);
      }, 750); // 750ms delay like Netflix
    } else {
      setShowVideoPreview(false);
    }

    return () => clearTimeout(hoverTimer);
  }, [isHovered]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Save pending course for post-login redirect
      sessionStorage.setItem('pendingCourseId', id);
      navigate('/login');
      return;
    }

    // User is authenticated, proceed to checkout
    openCheckout(course);
  };

  const handleEnrollClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Save pending course and redirect to login
      sessionStorage.setItem('pendingCourseId', id);
      navigate('/login');
      return;
    }

    // User is authenticated, proceed to course view
    navigate(`/courses/${slug}`);
  };

  if (variant === 'list') {
    return (
      <Link to={`/courses/${slug}`}>
        <Card className="flex overflow-hidden transition-all hover:shadow-lg">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-64 object-cover"
          />
          <div className="flex-1 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="primary">{category}</Badge>
              <Badge variant="outline">{level}</Badge>
            </div>
            <h3 className="mb-2 text-xl font-bold text-text line-clamp-2 font-heading">
              {title}
            </h3>
            <div className="mb-4 flex items-center gap-4 text-sm text-muted">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
                <span>({reviewCount.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{enrolledCount.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={instructor?.avatar} alt={instructor?.name} size="sm" fallback={instructor?.name} />
                <span className="text-sm text-muted">{instructor?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {discountPrice && (
                  <span className="text-lg text-muted line-through">
                    {formatPrice(price)}
                  </span>
                )}
                <span className="text-2xl font-bold text-primary font-heading">
                  {formatPrice(discountPrice || price)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <Link to={`/courses/${slug}`}>
            <img
              src={thumbnail}
              alt={title}
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Video Preview Overlay */}
          <VideoPreview
            thumbnail={thumbnail}
            title={title}
            isVisible={showVideoPreview}
          />

          {/* Discount Badge */}
          {discountPrice && (
            <Badge className="absolute right-3 top-3 z-10" variant="accent">
              {Math.round(((price - discountPrice) / price) * 100)}% OFF
            </Badge>
          )}

          {/* Quick Buy Overlay - appears on hover (when video preview is not showing) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isHovered && !showVideoPreview ? 1 : 0,
              y: isHovered && !showVideoPreview ? 0 : 20
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"
          >
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={`/learn/${id}`}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
                  >
                    <Play className="h-5 w-5" />
                    Go to Course
                  </Link>
                  <Link
                    to={`/courses/${slug}`}
                    className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
                  >
                    <Play className="h-4 w-4" />
                    View Details
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Enroll Now
                  </button>
                  <Link
                    to={`/courses/${slug}`}
                    className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
                  >
                    <Play className="h-4 w-4" />
                    Preview
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>

        <Link to={`/courses/${slug}`}>
          <div className="p-5">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="primary" className="text-xs">
                {category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {level}
              </Badge>
            </div>
            <h3 className="mb-3 text-lg font-bold text-text line-clamp-2 font-heading group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="mb-3 flex items-center justify-between text-sm text-muted">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
                <span>({reviewCount.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-2">
                <Avatar src={instructor?.avatar} alt={instructor?.name} size="sm" fallback={instructor?.name} />
                <span className="text-sm text-muted line-clamp-1">{instructor?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {discountPrice && (
                  <span className="text-sm text-muted line-through">
                    {formatPrice(price)}
                  </span>
                )}
                <span className="text-xl font-bold text-primary font-heading">
                  {formatPrice(discountPrice || price)}
                </span>
              </div>
            </div>

            {/* Mobile Buy Now Button */}
            <div className="mt-4 lg:hidden">
              {isAuthenticated ? (
                <Link
                  to={`/learn/${id}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  <Play className="h-4 w-4" />
                  Go to Course
                </Link>
              ) : (
                <button
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
}
