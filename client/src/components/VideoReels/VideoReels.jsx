import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import styles from './VideoReels.module.css';

// External video URLs (stock food videos for production)
// Replace these with your own CDN-hosted videos for custom content
const v1Video = 'https://videos.pexels.com/video-files/4252948/4252948-sd_506_960_25fps.mp4';
const v2Video = 'https://videos.pexels.com/video-files/3195394/3195394-sd_506_960_25fps.mp4';
const v3Video = 'https://videos.pexels.com/video-files/3298572/3298572-sd_506_960_25fps.mp4';
const chefVideo = 'https://videos.pexels.com/video-files/2257010/2257010-sd_506_960_30fps.mp4';
const pastaVideo = 'https://videos.pexels.com/video-files/2911757/2911757-sd_506_960_25fps.mp4';

const VIDEO_DATA = [
  {
    id: 1,
    url: v1Video,
    title: 'The Perfect Pour',
    description: 'Every cup is crafted with precision by our expert baristas. We source only the finest organic beans, roasting them in-house to ensure an unforgettable, rich flavor profile in every single drop.'
  },
  {
    id: 2,
    url: v2Video,
    title: 'Protein Packed',
    description: 'Fuel your focus with our signature bowls. Packed with locally sourced greens, lean proteins, and house-made dressings, every bite is designed to give you sustained energy throughout your workday.'
  },
  {
    id: 3,
    url: v3Video,
    title: 'Fresh Ingredients',
    description: 'We believe that great food starts with exceptional ingredients. Sourced daily from local organic farms, our produce ensures maximum flavor, vibrant colors, and optimal nutrition for every meal.'
  },
  {
    id: 4,
    url: chefVideo,
    title: 'Chef in Action',
    description: 'Watch our head chef bring passion and precision to the kitchen. From the sizzle of the pan to the final artistic garnish, every dish is a culinary masterpiece prepared fresh to order.'
  },
  {
    id: 5,
    url: pastaVideo,
    title: 'Pasta Perfection',
    description: 'Experience the magic of handcrafted pasta made fresh daily. Kneaded with care and cooked to al dente perfection, our dishes combine traditional techniques with bold, modern flavors.'
  }
];

/**
 * Generates a poster thumbnail from the first frame of a video.
 * This gives users an instant visual preview without downloading the full video.
 */
const generatePoster = (videoUrl) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'metadata';

    video.addEventListener('loadeddata', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 480;
        canvas.height = video.videoHeight || 854;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/webp', 0.6);
        resolve(dataUrl);
      } catch {
        resolve(null);
      } finally {
        video.src = '';
        video.load();
      }
    });

    video.addEventListener('error', () => resolve(null));

    // Seek to 0.5s to get a more representative frame (not a black frame)
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0.5;
    });

    video.src = videoUrl;
  });
};

const ReelVideo = ({ video, isActive, isNearby, isMuted, toggleMute, onVideoEnd, poster }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Determine what preload strategy to use:
  // - Active video: load fully and play
  // - Nearby (±1): preload metadata so playback starts fast when scrolled to
  // - Far away: don't load anything
  const shouldLoadSrc = isActive || isNearby;
  const preloadValue = isActive ? 'auto' : isNearby ? 'metadata' : 'none';

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive) {
      setIsLoading(true);
      setIsPaused(false);

      // Wait for enough data before playing to avoid buffering mid-play
      const tryPlay = () => {
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsLoading(false))
            .catch((error) => {
              console.log('Auto-play prevented by browser:', error);
              setIsLoading(false);
            });
        }
      };

      // If we have enough buffered data, play immediately
      if (vid.readyState >= 3) {
        tryPlay();
      } else {
        // Wait until we have enough buffered data to play without stuttering
        const onCanPlay = () => {
          tryPlay();
          vid.removeEventListener('canplay', onCanPlay);
        };
        vid.addEventListener('canplay', onCanPlay);
        return () => vid.removeEventListener('canplay', onCanPlay);
      }
    } else {
      // Pause when inactive but keep current time to resume from same spot
      vid.pause();
      setIsPaused(false);
      setIsLoading(true);
    }
  }, [isActive]);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setIsPaused(false);
    } else {
      vid.pause();
      setIsPaused(true);
    }
  }, []);

  return (
    <>
      {/* Loading state: show poster or spinner */}
      {isLoading && isActive && (
        <div className={styles.loadingOverlay}>
          {poster && (
            <img
              src={poster}
              alt=""
              className={styles.posterImage}
              aria-hidden="true"
            />
          )}
          <div className={styles.loadingSpinner} />
        </div>
      )}

      {/* Show static poster when not active and not loading video */}
      {!isActive && poster && (
        <img
          src={poster}
          alt={video.title}
          className={styles.posterImage}
        />
      )}

      <video
        ref={videoRef}
        // Only set src if this video is active or nearby — prevents downloading distant videos
        src={shouldLoadSrc ? video.url : undefined}
        className={styles.videoElement}
        loop={false}
        muted={isMuted}
        playsInline
        preload={preloadValue}
        poster={poster || undefined}
        onLoadedData={() => {
          if (isActive) setIsLoading(false);
        }}
        onWaiting={() => {
          if (isActive) setIsLoading(true);
        }}
        onPlaying={() => setIsLoading(false)}
        onEnded={onVideoEnd}
        onClick={(e) => {
          if (!window.wasDraggedVideo) toggleMute();
        }}
      />

      {/* Pause indicator */}
      {isPaused && isActive && (
        <div className={styles.pauseIndicator}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      <div className={styles.overlay}>
        <div className={styles.overlayTop}>
          {/* We can put other top-level overlay items here if needed */}
        </div>
        <div className={styles.controls}>
          <button
            className={styles.iconButton}
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
    </>
  );
};

const VideoReels = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [activeId, setActiveId] = useState(VIDEO_DATA[0].id);
  const [isMuted, setIsMuted] = useState(true);
  const [posters, setPosters] = useState({});
  const wrapperRefs = useRef([]);

  // Generate poster thumbnails on mount — lightweight first-frame captures
  useEffect(() => {
    let cancelled = false;

    const generatePosters = async () => {
      for (const video of VIDEO_DATA) {
        if (cancelled) break;
        const posterUrl = await generatePoster(video.url);
        if (!cancelled && posterUrl) {
          setPosters((prev) => ({ ...prev, [video.id]: posterUrl }));
        }
      }
    };

    generatePosters();
    return () => { cancelled = true; };
  }, []);

  // Find the active index so we can determine "nearby" videos
  const activeIndex = useMemo(
    () => VIDEO_DATA.findIndex((v) => v.id === activeId),
    [activeId]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(Number(entry.target.dataset.id));
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      }
    );

    wrapperRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const scrollTopRef = useRef(0);
  const wasDragged = useRef(false);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    wasDragged.current = false;
    startY.current = e.pageY || e.touches?.[0]?.pageY || 0;
    scrollTopRef.current = containerRef.current.scrollTop;
    containerRef.current.style.scrollSnapType = 'none'; // disable snap during drag
    containerRef.current.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // prevent text selection
    const y = e.pageY || e.touches?.[0]?.pageY || 0;
    const walk = (startY.current - y);
    if (Math.abs(walk) > 5) {
      wasDragged.current = true;
    }
    containerRef.current.scrollTop = scrollTopRef.current + walk * 1.5;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    containerRef.current.style.cursor = '';
    
    // Store globally so the video click handler can read it synchronously
    window.wasDraggedVideo = wasDragged.current;
    setTimeout(() => { window.wasDraggedVideo = false; }, 50);

    // Smoothly snap to the closest reel manually
    const container = containerRef.current;
    const itemHeight = container.clientHeight;
    const scrollY = container.scrollTop;
    
    // Calculate the nearest index
    const closestIndex = Math.max(0, Math.min(VIDEO_DATA.length - 1, Math.round(scrollY / itemHeight)));
    
    const targetElement = wrapperRefs.current[closestIndex];
    if (targetElement && container) {
      container.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
    }
    
    // Re-enable native snapping after smooth scroll completes
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.scrollSnapType = 'y mandatory';
      }
    }, 600);
  };

  const handleVideoEnd = useCallback((currentIndex) => {
    const container = containerRef.current;
    if (!container) return;

    if (currentIndex < VIDEO_DATA.length - 1) {
      const nextElement = wrapperRefs.current[currentIndex + 1];
      if (nextElement) {
        container.scrollTo({ top: nextElement.offsetTop, behavior: 'smooth' });
      }
    } else {
      // Loop back to the first video when the last one ends
      const firstElement = wrapperRefs.current[0];
      if (firstElement) {
        container.scrollTo({ top: firstElement.offsetTop, behavior: 'smooth' });
      }
    }
  }, []);

  const activeVideo = VIDEO_DATA[activeIndex] || VIDEO_DATA[0];

  return (
    <section className={styles.reelsSection} id="video-reels" ref={sectionRef}>
      <div className={styles.reelsSectionInner}>
        <div className={styles.sectionHeader}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVideo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={styles.animatedHeader}
            >
              <div className={styles.watermark} aria-hidden="true">
                {String(activeIndex + 1).padStart(2, '0')}
              </div>
              <span className={styles.sectionLabel}>Kitchen Cam</span>
              <h3 className={styles.sectionHeading}>{activeVideo.title}</h3>
              <p className={styles.sectionDescription}>
                {activeVideo.description}
              </p>
              
              <div className={styles.actionButtons}>
                <Button variant="filled" size="md" href="/menu">Explore Menu</Button>
                <Button variant="outlined" size="md" href="/#membership">Get a Subscription</Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div 
          className={styles.reelsContainer} 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ cursor: 'grab' }}
        >
          {VIDEO_DATA.map((video, index) => {
            const isNearby =
              !activeId !== video.id &&
              Math.abs(index - activeIndex) <= 1;

            return (
              <div
                key={video.id}
                data-id={video.id}
                className={styles.reelWrapper}
                ref={(el) => (wrapperRefs.current[index] = el)}
              >
                <ReelVideo
                  video={video}
                  isActive={activeId === video.id}
                  isNearby={isNearby}
                  isMuted={isMuted}
                  toggleMute={() => setIsMuted(!isMuted)}
                  onVideoEnd={() => handleVideoEnd(index)}
                  poster={posters[video.id] || null}
                />
                {/* Scroll indicator on the very first video */}
                {index === 0 && activeId === video.id && (
                  <div className={styles.scrollIndicator}>
                    <div className={styles.scrollHand}>👆</div>
                    <span>Scroll</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Vertical Progress Bar */}
        <div className={styles.progressContainer}>
          {VIDEO_DATA.map((video, index) => (
            <button
              key={video.id}
              className={`${styles.progressDot} ${activeId === video.id ? styles.progressDotActive : ''}`}
              onClick={() => {
                const el = wrapperRefs.current[index];
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label={`Go to reel ${index + 1}: ${video.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoReels;
