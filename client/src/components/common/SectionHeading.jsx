import React from 'react';

/**
 * SectionHeading — Renders an uppercase label, large heading (with optional italic word),
 * and optional description text. Supports light mode for dark backgrounds.
 */
const SectionHeading = ({ 
  label, 
  heading, 
  italicWord,
  description, 
  align = 'left',
  light = false,
  className = '' 
}) => {
  const containerStyle = {
    textAlign: align,
    maxWidth: align === 'center' ? '700px' : 'none',
    margin: align === 'center' ? '0 auto' : '0',
  };

  const labelStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--fs-label)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: light ? 'rgba(255,255,255,0.7)' : 'var(--terracotta)',
    marginBottom: 'var(--space-lg)',
    display: 'block',
  };

  const headingStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--fs-h1)',
    fontWeight: 500,
    lineHeight: 1.15,
    color: light ? 'var(--white)' : 'var(--espresso)',
    marginBottom: description ? 'var(--space-lg)' : '0',
  };

  const descriptionStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--fs-body)',
    lineHeight: 1.6,
    color: light ? 'rgba(255,255,255,0.8)' : 'var(--espresso-soft)',
    maxWidth: '50ch',
    margin: align === 'center' ? '0 auto' : '0',
  };

  const renderHeading = () => {
    if (!italicWord) return heading;
    const parts = heading.split(italicWord);
    return (
      <>
        {parts[0]}
        <em style={{ fontStyle: 'italic' }}>{italicWord}</em>
        {parts[1] || ''}
      </>
    );
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <span style={labelStyle}>{label}</span>}
      <h2 style={headingStyle}>{renderHeading()}</h2>
      {description && <p style={descriptionStyle}>{description}</p>}
    </div>
  );
};

export default SectionHeading;
