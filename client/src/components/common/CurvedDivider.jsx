import React from 'react';

/**
 * CurvedDivider — SVG curve transition between two colored sections.
 * @param {string} direction - 'down' (bows into bottom) or 'up' (bows into top)
 */
const CurvedDivider = ({
  topColor = 'var(--white)',
  bottomColor = 'var(--warm-cream)',
  direction = 'down',
  height = '7vw'
}) => {
  return (
    <div 
      className="curved-divider"
      style={{ 
        width: '100%', 
        height, 
        backgroundColor: direction === 'down' ? bottomColor : topColor, 
        position: 'relative',
        display: 'block',
        lineHeight: 0,
        marginTop: '-2px',
        marginBottom: '-2px',
        zIndex: 2
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        style={{ width: '100%', height: '100%', display: 'block', transform: 'scale(1.05)' }}
      >
        {direction === 'down' ? (
          <path d="M0,0 Q50,200 100,0 Z" fill={topColor} />
        ) : (
          <path d="M0,100 Q50,-100 100,100 Z" fill={bottomColor} />
        )}
      </svg>
    </div>
  );
};

export default CurvedDivider;
