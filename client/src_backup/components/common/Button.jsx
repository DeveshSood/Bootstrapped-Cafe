import React from 'react';
import styles from './Button.module.css';

import { Link } from 'react-router-dom';

/**
 * Button — SAVORA-style CTA button
 * 
 * Variants:
 *  - "filled" (terracotta background, white text)
 *  - "outlined" (dark border, transparent bg)
 *  - "outlined-light" (white border, for dark backgrounds)
 *  - "text" (no border, just text + arrow)
 */
const Button = ({ 
  children, 
  variant = 'filled', 
  size = 'md',
  icon,
  onClick, 
  href,
  className = '',
  ...props 
}) => {
  const classes = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    className
  ].filter(Boolean).join(' ');

  if (href) {
    const isExternal = href.startsWith('http');
    if (isExternal) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
          <span className={styles.buttonText}>{children}</span>
          {icon && <span className={styles.buttonIcon}>{icon}</span>}
        </a>
      );
    }
    return (
      <Link to={href} className={classes} {...props}>
        <span className={styles.buttonText}>{children}</span>
        {icon && <span className={styles.buttonIcon}>{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      <span className={styles.buttonText}>{children}</span>
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
    </button>
  );
};

export default Button;
