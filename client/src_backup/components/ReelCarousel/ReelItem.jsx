import React, { useState, useRef, useEffect } from 'react';

const reelItemStyles = {
  container: {
    width: '240px',
    cursor: 'pointer',
    position: 'relative',
    transformStyle: 'preserve-3d', // Fix text blur during transform
    willChange: 'transform',
  },
  thumbnail: {
    position: 'relative',
    width: '100%',
    height: '420px',
    borderRadius: '24px',
    overflow: 'hidden',
    backgroundColor: '#E8E3DC',
    boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(30,24,21,0) 0%, rgba(30,24,21,0.5) 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  muteBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(30,24,21,0.6)',
    backdropFilter: 'blur(4px)',
    color: '#FAF7F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    pointerEvents: 'auto',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  label: {
    marginTop: '15px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#1E1815',
    textAlign: 'center',
    transition: 'opacity 0.3s',
  },
  activeRing: {
    border: '3px solid #C8512D',
  },
};

const ReelItem = ({ title, videoUrl, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div
      style={{
        ...reelItemStyles.container,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Play reel: ${title}`}
    >
      <div
        style={{
          ...reelItemStyles.thumbnail,
          ...(isActive ? reelItemStyles.activeRing : {}),
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          muted={isMuted}
          loop
          playsInline
          style={{
            ...reelItemStyles.video,
          }}
        />
        
        <div style={reelItemStyles.overlay}>
          {isActive && (
            <button style={reelItemStyles.muteBtn} onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? '🔇' : '🔊'}
            </button>
          )}
        </div>
      </div>
      <div style={{...reelItemStyles.label, opacity: isActive ? 1 : 0.6}}>{title}</div>
    </div>
  );
};

export default ReelItem;
