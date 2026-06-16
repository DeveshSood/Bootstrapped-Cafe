import React from 'react';
import '../../styles/grain-overlay.css';

/**
 * GrainOverlay — Fixed full-page noise texture overlay
 * Creates the signature matte-finish aesthetic.
 * Uses CSS SVG fallback (no external PNG needed).
 */
const GrainOverlay = () => {
  return (
    <div 
      className="grain-overlay--css" 
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default GrainOverlay;
