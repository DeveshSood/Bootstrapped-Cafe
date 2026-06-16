import React from 'react';

/**
 * CurvedDivider
 * 
 * Creates a smooth SVG curve to transition between two sections.
 * 
 * @param {string} topColor - CSS color value for the top section
 * @param {string} bottomColor - CSS color value for the bottom section
 * @param {string} direction - 'down' (bows down into bottom) or 'up' (bows up into top)
 * @param {string} height - CSS height (default 6vw for responsive curve)
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
          // Bows downward from the top edge. Filled with topColor.
          <path d="M0,0 Q50,200 100,0 Z" fill={topColor} />
        ) : (
          // Bows upward from the bottom edge. Filled with bottomColor.
          <path d="M0,100 Q50,-100 100,100 Z" fill={bottomColor} />
        )}
      </svg>
    </div>
  );
};

export default CurvedDivider;
