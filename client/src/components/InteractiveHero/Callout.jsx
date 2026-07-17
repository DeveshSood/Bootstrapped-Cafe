import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Utensils, CupSoda, Coffee, Monitor, Users } from 'lucide-react';

const ICONS = {
  Leaf, Utensils, CupSoda, Coffee, Monitor, Users
};

export default function Callout({ data, isHovered, isDimmed, onHover, onLeave, onClick, isLoaded = true }) {
  const IconComponent = ICONS[data.icon] || Leaf;

  // The line needs to connect from the dot to the text block.
  // We can use an SVG overlay for the entire screen.

  // Calculate text connection point based on side
  // If it's on the left, we connect to the right side of the icon.
  // We'll just draw the line from the exact textPos to dotPos, and rely on padding.
  // But wait, the SVG line will be under the text block, so it looks like it connects to its center.

  return (
    <>
      {/* SVG Connecting Line */}
      <svg
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
          opacity: isDimmed ? 0 : 1,
          transition: 'opacity 0.4s ease'
        }}
      >
        <motion.line
          x1={data.lineTarget ? data.lineTarget.x : `calc(${data.textPos.left} ${parseFloat(data.dotPos.left) > parseFloat(data.textPos.left) ? '+' : '-'} 120px)`}
          y1={data.lineTarget ? data.lineTarget.y : data.textPos.top}
          x2={data.dotPos.left}
          y2={data.dotPos.top}
          stroke="rgba(161, 168, 92, 0.8)" // subtle greenish
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isLoaded ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ 
            pathLength: { duration: 1.5, ease: "easeOut", delay: 0.4 },
            opacity: { duration: 0.5, delay: 0.4 }
          }}
        />
      </svg>

      {/* Target Dot on the Image */}
      <div
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        style={{
          position: 'absolute',
          top: data.dotPos.top,
          left: data.dotPos.left,
          transform: 'translate(-50%, -50%)',
          width: '32px',
          height: '32px',
          zIndex: 20,
          cursor: 'crosshair',
          opacity: isDimmed ? 0 : 1,
          transition: 'opacity 0.4s ease'
        }}
      >
        <motion.div
          animate={{ scale: isHovered ? 1.5 : 1 }}
          style={{
            position: 'absolute',
            top: '12px', left: '12px',
            width: '8px', height: '8px',
            backgroundColor: '#a1a85c',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(161, 168, 92, 0.8)'
          }}
        />
      </div>

      {/* Text Block */}
      <div
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
        style={{
          position: 'absolute',
          top: data.textPos.top,
          left: data.textPos.left,
          transform: 'translate(-50%, -50%)', // Center on the connection point
          zIndex: 20,
          opacity: isDimmed ? 0 : 1,
          transition: 'opacity 0.4s ease',
          display: 'flex',
          flexDirection: data.side === 'left' ? 'row' : 'row-reverse',
          alignItems: 'flex-start',
          gap: '16px',
          width: 'max-content',
          cursor: 'pointer'
        }}
      >
        {/* Icon */}
        <div style={{
          width: '40px', height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(161, 168, 92, 0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
          color: '#a1a85c',
          flexShrink: 0
        }}>
          <IconComponent size={20} strokeWidth={1.5} />
        </div>
        {/* Text Area */}
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: data.side === 'left' ? 'left' : 'right', position: 'relative' }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.2rem', 
            fontWeight: '700', 
            color: '#fff', 
            letterSpacing: '0.5px',
            textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.8)'
          }}>
            {data.title}
          </h3>
          <p style={{ 
            margin: '4px 0 0', 
            fontSize: '0.9rem', 
            color: '#eaeaea', 
            fontWeight: '500', 
            lineHeight: '1.4', 
            maxWidth: '220px',
            textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.8)'
          }}>
            {data.description}
          </p>
        </div>
      </div>
    </>
  );
}
