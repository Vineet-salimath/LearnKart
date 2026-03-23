import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const VideoPreview = ({
  thumbnail,
  title,
  isVisible,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isVisible && isPlaying) {
      // Simulate video progress
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 2));
      }, 100);
    } else {
      setProgress(0);
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isVisible, isPlaying]);

  useEffect(() => {
    if (isVisible) {
      // Auto-play after 500ms delay (realistic preview behavior)
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("absolute inset-0 bg-black", className)}
        >
          {/* Video Preview Image with Overlay */}
          <div className="relative h-full w-full">
            {/* Simulated Video Frame */}
            <div className="relative h-full w-full">
              <img
                src={thumbnail}
                alt={title}
                className="h-full w-full object-cover"
              />

              {/* Video Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

              {/* Playing indicator - animated dots */}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full"
                >
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="h-1 w-1 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="h-1 w-1 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="h-1 w-1 bg-white rounded-full"
                    />
                  </div>
                  <span className="text-white text-xs font-medium">PREVIEW</span>
                </motion.div>
              )}

              {/* Video Controls Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-4"
              >
                {/* Progress Bar */}
                <div className="mb-3 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>

                    <span className="text-white text-sm font-medium">
                      {Math.floor(progress / 4)}:{String(Math.floor((progress % 4) * 15)).padStart(2, '0')}
                    </span>
                  </div>

                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* Course Info Banner */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 max-w-xs"
              >
                <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                  {title}
                </h4>
                <p className="text-white/80 text-xs">
                  Preview • Introduction to Course
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};