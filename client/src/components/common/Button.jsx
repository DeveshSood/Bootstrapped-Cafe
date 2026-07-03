import React from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router-dom';

/**
 * Button — Reusable CTA button component.
 * Variants: "filled" | "outlined" | "outlined-light" | "text"
 * Renders as <a>, <Link>, or <button> depending on the `href` prop.
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
    const isHash = href.startsWith('#');
    if (isExternal || isHash) {
      return (
        <a href={href} className={classes} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} {...props}>
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
