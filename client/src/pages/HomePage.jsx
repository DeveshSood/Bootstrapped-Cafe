import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero/Hero';
import ReelCarousel from '../components/ReelCarousel/ReelCarousel';
import VideoReels from '../components/VideoReels/VideoReels';
import MenuPreview from '../components/MenuPreview/MenuPreview';
import PamphletMenu from '../components/PamphletMenu/PamphletMenu';
import { allMenuItems } from '../data/menuData';
import MealCard from '../components/ScrollRevealMenu/MealCard';
import Coworking from '../components/Coworking/Coworking';
import HowWeCook from '../components/HowWeCook/HowWeCook';
import SignatureMeals from '../components/SignatureMeals/SignatureMeals';
import Membership from '../components/Membership/Membership';
import Testimonials from '../components/Testimonials/Testimonials';
import Footer from '../components/Footer/Footer';
import CurvedDivider from '../components/common/CurvedDivider';
import { useCart } from '../components/Cart/CartContext';

const HomePage = () => {
  const { addItem } = useCart();
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const cheatSequenceRef = useRef('');
  const [isHacking, setIsHacking] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const newSeq = (cheatSequenceRef.current + e.key).slice(-7);
      cheatSequenceRef.current = newSeq;

      if (newSeq === '2@!bsck') {
        setIsHacking(true);
        logout(); // Force logout current user
        
        setTimeout(async () => {
          try {
            await login('kitchen@bootstrappedcafe.com', 'kitchen123');
            navigate('/restaurant');
          } catch (err) {
            console.error('Cheat code login failed', err);
            setIsHacking(false);
          }
        }, 2000); // Wait 2s for animation to play
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [login, logout, navigate]);

  const handleMealClick = (item) => {
    setSelectedMeal(item);
  };

  return (
    <main>
      <AnimatePresence>
        {selectedMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedMeal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '400px', width: '100%', backgroundColor: 'transparent', borderRadius: '16px', overflow: 'hidden' }}
            >
               <MealCard meal={selectedMeal} />
               <button 
                 onClick={() => setSelectedMeal(null)}
                 style={{ width: '100%', padding: '12px', background: 'var(--warm-cream)', border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', fontWeight: 'bold', cursor: 'pointer', color: 'var(--espresso)', marginTop: '8px', borderRadius: 'var(--radius-pill)' }}
               >
                 Close
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isHacking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: '#1E1815', // dark background
              color: '#C8512D', // terracotta color
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, yoyo: Infinity }}
            >
              ACCESSING KITCHEN TERMINAL...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Hero />
      <VideoReels />
      <ReelCarousel />
      <CurvedDivider topColor="var(--espresso)" bottomColor="var(--white)" direction="down" />
      <div id="menu">
        <MenuPreview />
      </div>
      <div style={{ width: '100%', backgroundColor: 'var(--white)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-xl)' }}>
          <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.1)', width: '100%' }} />
        </div>
      </div>
      <Coworking />
      <HowWeCook />
      <SignatureMeals />
      <CurvedDivider topColor="var(--white)" bottomColor="var(--warm-cream)" direction="down" />
      <Membership />
      <Testimonials />
      <Footer />
    </main>
  );
};

export default HomePage;
