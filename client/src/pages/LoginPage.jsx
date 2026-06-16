import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './LoginPage.module.css';

const QUOTES = [
  { text: 'Let food be thy medicine, and medicine be thy food.', author: 'Hippocrates' },
  { text: 'One cannot think well, love well, sleep well, if one has not dined well.', author: 'Virginia Woolf' },
  { text: 'The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.', author: 'Ann Wigmore' },
  { text: 'Take care of your body. It\'s the only place you have to live.', author: 'Jim Rohn' },
  { text: 'To eat is a necessity, but to eat intelligently is an art.', author: 'La Rochefoucauld' },
  { text: 'Your diet is a bank account. Good food choices are good investments.', author: 'Bethenny Frankel' },
  { text: 'When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.', author: 'Ayurvedic Proverb' },
];

const LoginPage = () => {
  const [mode, setMode] = useState('login'); // login | signup
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const { login, register, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after login — default to home
  const from = location.state?.from || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  // Cycle quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === 'signup') {
        if (form.password !== form.confirm) {
          toast.error('Passwords do not match');
          setSubmitting(false);
          return;
        }
        if (form.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setSubmitting(false);
          return;
        }
        await register(form.name, form.email, form.password);
        toast.success(`Welcome to Bootstrapped Cafe, ${form.name}!`);
      } else {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      }
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setForm({ name: '', email: '', password: '', confirm: '' });
  };

  const quote = QUOTES[quoteIndex];

  return (
    <main className={styles.loginPage}>
      {/* Left panel — quote section */}
      <div className={styles.quotePanel}>
        <div className={styles.quotePanelInner}>
          <motion.div
            className={styles.brandMark}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Bootstrapped Cafe
          </motion.div>

          <div className={styles.quoteContainer}>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={quoteIndex}
                className={styles.quoteText}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                "{quote.text}"
                <footer className={styles.quoteAuthor}>— {quote.author}</footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Quote dots */}
          <div className={styles.quoteDots}>
            {QUOTES.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === quoteIndex ? styles.dotActive : ''}`}
                onClick={() => setQuoteIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className={styles.formPanel}>
        <motion.div
          className={styles.formContainer}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className={styles.formTitle}>
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className={styles.formSubtitle}>
                {mode === 'login'
                  ? 'Sign in to access your orders and saved favourites.'
                  : 'Join us for healthier meals, delivered to your door.'}
              </p>

              <form onSubmit={handleSubmit} className={styles.form}>
                {mode === 'signup' && (
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Full Name</label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className={styles.fieldInput}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    placeholder="you@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Password</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className={styles.fieldInput}
                    placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                </div>

                {mode === 'signup' && (
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Confirm Password</label>
                    <input
                      name="confirm"
                      type="password"
                      value={form.confirm}
                      onChange={handleChange}
                      className={styles.fieldInput}
                      placeholder="Re-enter password"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                )}

                <motion.button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? (
                    <span className={styles.spinner} />
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </motion.button>
              </form>

              <p className={styles.switchText}>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button type="button" onClick={switchMode} className={styles.switchBtn}>
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
};

export default LoginPage;
