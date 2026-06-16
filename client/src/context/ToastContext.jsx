import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);
  toast.success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  toast.error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  toast.warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '10px',
        pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => removeToast(t.id)}
              style={{
                pointerEvents: 'auto',
                cursor: 'pointer',
                padding: '14px 20px',
                borderRadius: '10px',
                fontFamily: 'var(--font-body, "DM Sans", system-ui, sans-serif)',
                fontSize: '0.9rem',
                fontWeight: 500,
                maxWidth: '380px',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                borderLeft: '4px solid',
                ...TOAST_STYLES[t.type],
              }}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const TOAST_STYLES = {
  info: {
    background: 'rgba(250, 247, 242, 0.95)',
    color: '#1E1815',
    borderLeftColor: '#6B5B52',
  },
  success: {
    background: 'rgba(44, 85, 48, 0.95)',
    color: '#FFFFFF',
    borderLeftColor: '#3A7042',
  },
  error: {
    background: 'rgba(200, 81, 45, 0.95)',
    color: '#FFFFFF',
    borderLeftColor: '#A8421F',
  },
  warning: {
    background: 'rgba(139, 111, 71, 0.95)',
    color: '#FFFFFF',
    borderLeftColor: '#D4693F',
  },
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
