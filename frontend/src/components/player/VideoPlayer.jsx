import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/helpers';

// Load YouTube IFrame API
const loadYouTubeAPI = () => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };
  });
};

// Extract YouTube video ID from URL
const extractVideoId = (url) => {
  if (!url) return null;

  // If it's already just an ID
  if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
    return url;
  }

  // Extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

export function VideoPlayer({
  videoUrl,
  onComplete,
  onProgress,
  autoPlay = false,
  className
}) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [watchPercentage, setWatchPercentage] = useState(0);
  const progressCheckInterval = useRef(null);

  const videoId = extractVideoId(videoUrl);

  useEffect(() => {
    if (!videoId) return;

    let mounted = true;
    let playerInstance = null;

    const initPlayer = async () => {
      try {
        const YT = await loadYouTubeAPI();

        if (!mounted) return;

        playerInstance = new YT.Player(containerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: autoPlay ? 1 : 0,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
          },
          events: {
            onReady: (event) => {
              if (!mounted) return;
              setIsReady(true);
              setPlayer(event.target);
              playerRef.current = event.target;

              // Start tracking progress
              startProgressTracking(event.target);
            },
            onStateChange: (event) => {
              if (!mounted) return;

              // State 0 = ended
              if (event.data === 0) {
                handleVideoComplete();
              }

              // State 1 = playing
              if (event.data === 1) {
                startProgressTracking(event.target);
              }

              // State 2 = paused
              if (event.data === 2) {
                stopProgressTracking();
              }
            },
          },
        });
      } catch (error) {
        console.error('Error loading YouTube player:', error);
      }
    };

    initPlayer();

    return () => {
      mounted = false;
      stopProgressTracking();
      if (playerInstance && playerInstance.destroy) {
        playerInstance.destroy();
      }
    };
  }, [videoId, autoPlay]);

  const startProgressTracking = (playerInstance) => {
    stopProgressTracking();

    progressCheckInterval.current = setInterval(() => {
      if (playerInstance && playerInstance.getDuration) {
        const duration = playerInstance.getDuration();
        const currentTime = playerInstance.getCurrentTime();

        if (duration > 0) {
          const percentage = (currentTime / duration) * 100;
          setWatchPercentage(percentage);

          // Auto-complete at 90% watched (as per spec)
          if (percentage >= 90 && !isCompleted) {
            handleVideoComplete();
          }

          // Notify parent of progress
          if (onProgress) {
            onProgress({ currentTime, duration, percentage });
          }
        }
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressCheckInterval.current) {
      clearInterval(progressCheckInterval.current);
      progressCheckInterval.current = null;
    }
  };

  const handleVideoComplete = () => {
    if (isCompleted) return;

    setIsCompleted(true);
    stopProgressTracking();

    if (onComplete) {
      onComplete();
    }
  };

  const handleMarkComplete = () => {
    handleVideoComplete();
  };

  if (!videoId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
        <p className="text-muted">Invalid video URL</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Video Player Container */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
        <div ref={containerRef} className="h-full w-full" />

        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Loader className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {/* Progress indicator */}
        {isReady && watchPercentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(watchPercentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Manual Mark as Complete Button */}
      {isReady && !isCompleted && (
        <Button
          onClick={handleMarkComplete}
          variant="primary"
          className="w-full sm:w-auto"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Mark as Complete
        </Button>
      )}

      {isCompleted && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Lesson completed!</span>
        </div>
      )}
    </div>
  );
}
