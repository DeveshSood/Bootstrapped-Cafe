import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Digit = ({ digit, isGoingUp }) => {
  return (
    <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', width: '1ch', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
      <AnimatePresence mode="popLayout" initial={false} custom={isGoingUp}>
        <motion.span
          key={digit}
          custom={isGoingUp}
          // Rolling down when increasing, rolling up when decreasing
          initial={(up) => ({ y: up ? "-100%" : "100%", opacity: 0 })}
          animate={{ y: "0%", opacity: 1 }}
          exit={(up) => ({ y: up ? "100%" : "-100%", opacity: 0 })}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{ display: 'inline-block' }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const SlotCounter = ({ value, className, prefix = '₹' }) => {
  const prevValue = useRef(value);
  const isGoingUp = value > prevValue.current;
  
  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  const stringValue = value.toLocaleString();
  // Reverse to safely map digits from right to left (ones, tens, etc)
  const digits = stringValue.split('').reverse();

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
      {prefix && <span style={{ marginRight: '4px' }}>{prefix}</span>}
      <span style={{ display: 'inline-flex', flexDirection: 'row-reverse' }}>
        {digits.map((digit, i) => {
          if (digit === ',' || digit === '.') {
            return <span key={i} style={{ display: 'inline-block' }}>{digit}</span>;
          }
          return <Digit key={i} digit={digit} isGoingUp={isGoingUp} />;
        })}
      </span>
    </span>
  );
};

export default SlotCounter;
