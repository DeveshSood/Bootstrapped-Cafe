import React, { useState, useEffect } from 'react';
import styles from './PrepTimer.module.css';

const PrepTimer = ({ acceptedAt, estimatedPrepTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(100);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!acceptedAt || !estimatedPrepTime) return;

    const prepTimeMs = estimatedPrepTime * 60000;
    const startTime = new Date(acceptedAt).getTime();
    const targetTime = startTime + prepTimeMs;

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = targetTime - now;

      if (remainingMs <= 0) {
        setTimeLeft(0);
        setProgress(0);
        setIsOverdue(true);
      } else {
        setTimeLeft(remainingMs);
        setProgress((remainingMs / prepTimeMs) * 100);
        setIsOverdue(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [acceptedAt, estimatedPrepTime]);

  if (!acceptedAt || !estimatedPrepTime) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerWrapper}>
        <svg className={styles.svg} width="50" height="50">
          <circle
            className={styles.bgCircle}
            cx="25"
            cy="25"
            r={radius}
            strokeWidth="4"
          />
          <circle
            className={`${styles.progressCircle} ${isOverdue ? styles.overdue : ''}`}
            cx="25"
            cy="25"
            r={radius}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 25 25)"
          />
        </svg>
        <div className={`${styles.timeText} ${isOverdue ? styles.overdueText : ''}`}>
          {isOverdue ? 'LATE' : `${minutes}:${seconds.toString().padStart(2, '0')}`}
        </div>
      </div>
      <div className={styles.timerLabel}>
        {isOverdue ? 'Overdue!' : 'Prep Time'}
      </div>
    </div>
  );
};

export default PrepTimer;
