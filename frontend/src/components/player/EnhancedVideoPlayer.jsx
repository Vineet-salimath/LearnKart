import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Loader,
  AlertCircle,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/helpers';

// Video format detection
const detectVideoFormat = (url) => {
  if (!url) return null;

  const urlLower = url.toLowerCase();

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube';
  } else if (urlLower.endsWith('.m3u8')) {
    return 'hls';
  } else if (urlLower.match(/\.(mp4|webm|ogg|mov|avi)$/)) {
    return 'video';
  } else if (urlLower.includes('vimeo.com')) {
    return 'vimeo';
  }

  return 'unknown';
};

// Extract YouTube video ID
const extractYouTubeId = (url) => {
  if (!url) return null;

  if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
    return url;
  }

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

// Load HLS.js for HLS streaming support
const loadHLS = () => {
  return new Promise((resolve, reject) => {
    if (window.Hls) {
      resolve(window.Hls);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = () => resolve(window.Hls);
    script.onerror = () => reject(new Error('Failed to load HLS.js'));
    document.head.appendChild(script);
  });
};

// Load YouTube API
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

export function VideoPlayer({
  videoUrl,
  onComplete,
  onProgress,
  autoPlay = false,
  className
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const progressInterval = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [watchPercentage, setWatchPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoFormat = detectVideoFormat(videoUrl);
  const maxRetries = 3;

  // Initialize video player based on format
  useEffect(() => {
    if (!videoUrl) {
      setError('No video URL provided');
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const initializePlayer = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (videoFormat === 'youtube') {
          await initYouTubePlayer();
        } else if (videoFormat === 'hls') {
          await initHLSPlayer();
        } else if (videoFormat === 'video') {
          await initVideoPlayer();
        } else {
          throw new Error(`Unsupported video format: ${videoFormat}`);
        }

        if (mounted) {
          setIsReady(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    initializePlayer();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [videoUrl, retryCount]);

  // YouTube player initialization
  const initYouTubePlayer = async () => {
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const YT = await loadYouTubeAPI();

    return new Promise((resolve, reject) => {
      youtubePlayerRef.current = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            startProgressTracking();
            resolve();
          },
          onStateChange: (event) => {
            handleYouTubeStateChange(event);
          },
          onError: (event) => {
            reject(new Error(`YouTube player error: ${event.data}`));
          },
        },
      });
    });
  };

  // HLS player initialization
  const initHLSPlayer = async () => {
    if (!window.Hls && !videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      const Hls = await loadHLS();

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            videoRef.current?.play();
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            throw new Error(`HLS error: ${data.details}`);
          }
        });
      } else {
        throw new Error('HLS not supported on this browser');
      }
    } else {
      // Native HLS support (Safari)
      videoRef.current.src = videoUrl;
    }

    setupVideoEventListeners();
  };

  // Standard video player initialization
  const initVideoPlayer = () => {
    videoRef.current.src = videoUrl;
    setupVideoEventListeners();
  };

  // Setup event listeners for HTML5 video
  const setupVideoEventListeners = () => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadedmetadata', () => {
      setDuration(video.duration);
    });

    video.addEventListener('timeupdate', () => {
      setCurrentTime(video.currentTime);
      const percentage = (video.currentTime / video.duration) * 100;
      setWatchPercentage(percentage);

      if (onProgress) {
        onProgress({
          currentTime: video.currentTime,
          duration: video.duration,
          percentage,
        });
      }

      // Auto-complete at 90%
      if (percentage >= 90 && !isCompleted) {
        handleVideoComplete();
      }
    });

    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('ended', handleVideoComplete);

    video.addEventListener('error', (e) => {
      const error = video.error;
      const errorMessage = `Video error: ${error?.message || 'Unknown error'}`;
      setError(errorMessage);
    });

    if (autoPlay) {
      video.play().catch(err => {
        console.warn('Autoplay prevented:', err);
      });
    }
  };

  // Handle YouTube state changes
  const handleYouTubeStateChange = (event) => {
    const state = event.data;

    if (state === 0) { // ended
      handleVideoComplete();
    } else if (state === 1) { // playing
      setIsPlaying(true);
      startProgressTracking();
    } else if (state === 2) { // paused
      setIsPlaying(false);
      stopProgressTracking();
    }
  };

  // Progress tracking for YouTube
  const startProgressTracking = () => {
    stopProgressTracking();

    progressInterval.current = setInterval(() => {
      if (youtubePlayerRef.current && youtubePlayerRef.current.getDuration) {
        const duration = youtubePlayerRef.current.getDuration();
        const currentTime = youtubePlayerRef.current.getCurrentTime();

        if (duration > 0) {
          const percentage = (currentTime / duration) * 100;
          setWatchPercentage(percentage);
          setCurrentTime(currentTime);
          setDuration(duration);

          if (onProgress) {
            onProgress({ currentTime, duration, percentage });
          }

          if (percentage >= 90 && !isCompleted) {
            handleVideoComplete();
          }
        }
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Handle video completion
  const handleVideoComplete = () => {
    if (isCompleted) return;

    setIsCompleted(true);
    stopProgressTracking();

    if (onComplete) {
      onComplete();
    }
  };

  // Manual mark as complete
  const handleMarkComplete = () => {
    handleVideoComplete();
  };

  // Retry loading video
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError(null);
    }
  };

  // Control functions
  const togglePlay = () => {
    if (videoFormat === 'youtube' && youtubePlayerRef.current) {
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoFormat === 'youtube' && youtubePlayerRef.current) {
      if (isMuted) {
        youtubePlayerRef.current.unMute();
      } else {
        youtubePlayerRef.current.mute();
      }
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Cleanup
  const cleanup = () => {
    stopProgressTracking();

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (youtubePlayerRef.current && youtubePlayerRef.current.destroy) {
      youtubePlayerRef.current.destroy();
      youtubePlayerRef.current = null;
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Error state
  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100 border-2 border-dashed border-gray-300">
          <div className="text-center p-8">
            <AlertCircle className="h-12 w-12 text-error mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">Video Loading Error</h3>
            <p className="text-text-secondary mb-4 max-w-sm">
              {error}
            </p>
            {retryCount < maxRetries && (
              <Button
                onClick={handleRetry}
                variant="outline"
                className="mr-2"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry ({maxRetries - retryCount} left)
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Video Player Container */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        {videoFormat === 'youtube' ? (
          <div ref={containerRef} className="h-full w-full" />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full"
            controls={false}
            playsInline
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Custom Controls Overlay (for non-YouTube videos) */}
        {isReady && videoFormat !== 'youtube' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(watchPercentage, 100)}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-white/10 px-2 py-1 rounded">
                  {videoFormat.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      {isReady && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Progress: {Math.round(watchPercentage)}% • Format: {videoFormat.toUpperCase()}
          </div>
        </div>
      )}

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

      {/* Completion State */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 p-4 text-success"
        >
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Lesson completed!</span>
        </motion.div>
      )}
    </div>
  );
}