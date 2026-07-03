import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Callout from './Callout';
import Button from '../common/Button';
import homeBaseImg from '../../assets/images/Home base image.png';
import cwImg1 from '../../assets/images/cafe-bg.jpg';
import cwImg2 from '../../assets/images/Capsule Works - 3rd Floor - Bengaluru - 046.jpg';
import cwImg3 from '../../assets/images/Capsule Works - 3rd Floor - Bengaluru - 047.jpg';
import { ChevronDown } from 'lucide-react';

const calloutData = [
  {
    id: 'healthy-bowls',
    title: 'Healthy Bowls',
    description: 'Nutrient-packed, deliciously crafted for every goal.',
    side: 'left',
    icon: 'Leaf',
    textPos: { top: '53%', left: '15%' },
    dotPos: { top: '55%', left: '38%' },
    menuState: { viewMode: 'bowls', category: 'Healthy Bowls' }
  },
  {
    id: 'custom-salads',
    title: 'Custom Salads',
    description: 'Fresh ingredients, your way. Crafted by you, perfected by us.',
    side: 'left',
    icon: 'Utensils',
    textPos: { top: '68%', left: '15%' },
    dotPos: { top: '65%', left: '33%' },
    menuState: { viewMode: 'custom' }
  },
  {
    id: 'smoothies',
    title: 'Smoothies',
    description: 'Self-crafted and blended to boost your day naturally.',
    side: 'right',
    icon: 'CupSoda',
    textPos: { top: '45%', left: '72%' },
    dotPos: { top: '25%', left: '65%' },
    lineTarget: { x: 'calc(72% - 15px)', y: 'calc(45% - 20px)' },
    menuState: { viewMode: 'drinks', category: 'Smoothies' }
  },
  {
    id: 'healthy-drinks',
    title: 'Healthy Drinks',
    description: 'Refreshing homemade kombucha, functional and full of goodness.',
    side: 'right',
    icon: 'Coffee',
    textPos: { top: '75%', left: '60%' },
    dotPos: { top: '80%', left: '80%' },
    lineTarget: { x: 'calc(60% + 170px)', y: '75%' },
    menuState: { viewMode: 'drinks', category: 'Home brewed drinks' }
  }
];

export default function InteractiveHero({ isLoaded = true }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [heroMode, setHeroMode] = useState('food'); // 'food' or 'coworking'
  const [cwImageIndex, setCwImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const cwImages = [cwImg1, cwImg2, cwImg3];

  // Sync heroMode with Navbar
  useEffect(() => {
    const handleSet = (e) => {
      setHeroMode(e.detail);
      if (e.detail === 'coworking') {
          setCwImageIndex(0);
      }
    };
    window.addEventListener('setHeroMode', handleSet);
    return () => window.removeEventListener('setHeroMode', handleSet);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('heroModeChange', { detail: heroMode }));
  }, [heroMode]);

  // Auto-switch mode every 10 seconds, unless scrolled or hovered
  useEffect(() => {
    if (isHovering || hoveredId !== null) return;
    const modeTimer = setInterval(() => {
      if (window.scrollY < 100) {
        setHeroMode(prev => {
          const next = prev === 'food' ? 'coworking' : 'food';
          if (next === 'coworking') {
            setCwImageIndex(0);
          }
          return next;
        });
      }
    }, 10000);
    return () => clearInterval(modeTimer);
  }, [isHovering, hoveredId]);

  // Slideshow for Coworking (approx 3.3s per image = 10s total cycle)
  useEffect(() => {
    if (heroMode !== 'coworking' || isHovering || hoveredId !== null) return;
    const slideTimer = setInterval(() => {
      setCwImageIndex(prev => (prev + 1) % cwImages.length);
    }, 3333);
    return () => clearInterval(slideTimer);
  }, [heroMode, cwImages.length, isHovering, hoveredId]);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
        color: '#fff',
        fontFamily: 'Inter, sans-serif'
      }}
      id="hero"
    >
      {/* Hidden preloader for all heavy images to prevent pop-in / lag */}
      <div style={{ display: 'none' }}>
        <img src={homeBaseImg} alt="preload" />
        {cwImages.map((src) => <img key={src} src={src} alt="preload" />)}
      </div>

      <AnimatePresence>
        {heroMode === 'food' ? (
          <motion.div
            key="food-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: heroMode === 'food' ? 2 : 1 }}
          >
            {/* Background Image */}
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={isLoaded ? { scale: 1, opacity: 1 } : { scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${homeBaseImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: hoveredId ? 'brightness(0.35)' : 'brightness(0.7)',
                transition: 'filter 0.3s ease'
              }}
            />

            {/* Top Left Typography */}
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '8%',
              zIndex: 10,
              maxWidth: '500px',
              opacity: hoveredId ? 0.2 : 1,
              transition: 'opacity 0.3s ease'
            }}>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                style={{
                  position: 'relative',
                  width: 'max-content',
                  color: '#f5d061', // soft golden yellow
                  fontSize: '0.85rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  marginBottom: '16px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.9)'
                }}
              >
                Clean Ingredients. Real Results.
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                style={{
                  position: 'relative',
                  width: 'max-content',
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '4.5rem',
                  lineHeight: '1.1',
                  margin: 0,
                  fontWeight: '700',
                  color: '#fff',
                  textShadow: '0 4px 15px rgba(0,0,0,0.9)'
                }}
              >
                Fuel your body,<br />
                <span style={{ color: '#f5d061', fontStyle: 'italic', fontWeight: '400', textShadow: '0 4px 15px rgba(0,0,0,0.9)' }}>free your mind.</span>
              </motion.h1>
            </div>

            {/* Bottom Buttons */}
            <div 
              style={{
                position: 'absolute',
                bottom: '15%',
                left: '8%',
                zIndex: 10,
                display: 'flex',
                gap: '16px',
                opacity: hoveredId ? 0.2 : 1,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Button variant="filled" size="md" href="/menu">
                Explore Menu
              </Button>
              <Button variant="outlined-light" size="md" href="/#coworking">
                Book a Table
              </Button>
            </div>

            {/* Callouts */}
            {calloutData.map((callout) => (
              <Callout
                key={callout.id}
                data={callout}
                isHovered={hoveredId === callout.id}
                isDimmed={hoveredId !== null && hoveredId !== callout.id}
                onHover={() => setHoveredId(callout.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => navigate('/menu', { state: callout.menuState })}
                isLoaded={isLoaded}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="coworking-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: heroMode === 'coworking' ? 2 : 1 }}
          >
            {/* Background Slideshow */}
            {cwImages.map((src, idx) => (
              <div
                key={src}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.5)',
                  opacity: idx === cwImageIndex ? 1 : 0,
                  zIndex: idx === cwImageIndex ? 2 : 1,
                  transition: 'opacity 1.5s ease-in-out'
                }}
              />
            ))}

            {/* Dark overlay for better text readability */}
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 100%)',
                zIndex: 5
              }}
            />

            {/* Left Typography */}
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '8%',
              zIndex: 10,
              maxWidth: '650px'
            }}>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                style={{
                  color: '#f5d061',
                  fontSize: '0.85rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  marginBottom: '16px',
                  willChange: 'transform, opacity'
                }}
              >
                Work & Wellness Combined
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '4.5rem',
                  lineHeight: '1.1',
                  margin: 0,
                  fontWeight: '700',
                  color: '#fff',
                  textShadow: '0 4px 15px rgba(0,0,0,0.8)',
                  willChange: 'transform, opacity'
                }}
              >
                HEALTHY FOOD MEETS <span style={{ color: '#f5d061', fontStyle: 'italic', fontWeight: '400' }}>COWORKING</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                style={{
                  marginTop: '24px',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: '500px',
                  willChange: 'transform, opacity'
                }}
              >
                A premium coworking space designed for students, freelancers, and teams who value wellness as much as productivity.
              </motion.p>

              {/* Bottom Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                style={{ marginTop: '40px', display: 'flex', gap: '16px', willChange: 'transform, opacity' }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Button variant="filled" size="md" href="/coworking">
                  Explore Subscriptions
                </Button>
                <Button variant="outlined-light" size="md" href="/contact">
                  Book a Desk
                </Button>
              </motion.div>
            </div>

            {/* Slide Count Indicator */}
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '6%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10
            }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '3.5rem', fontWeight: '400', color: '#fff', lineHeight: '1' }}>
                0{cwImageIndex + 1}
              </span>
              <span style={{ fontSize: '1.2rem', color: '#888', marginTop: '4px', marginBottom: '24px' }}>
                /03
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cwImages.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: idx === cwImageIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                      transition: 'background-color 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Right Cards (Rendered outside AnimatePresence so they persist across modes) */}
      <div 
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '8%',
          zIndex: 20,
          display: 'flex',
          gap: '16px',
          opacity: hoveredId ? 0.2 : 1,
          transition: 'opacity 0.3s ease'
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <StatCard value="50+" label="HEALTHY COMBOS" onClick={() => navigate('/menu')} />
        <StatCard value="₹599" label="COWORKING PASS" onClick={() => {
          document.getElementById('coworking')?.scrollIntoView({ behavior: 'smooth' });
        }} />
        <StatCard value="Custom" label="OFFICE MEALS" onClick={() => navigate('/contact')} />
      </div>

      {/* Scroll Down Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '4%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: (heroMode === 'food' && hoveredId) ? 0 : 0.6,
          transition: 'opacity 0.3s ease',
          zIndex: 50
        }}>
        <motion.div
          animate={{ y: [0, 15, 0], opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 5, ease: "easeInOut" }}
          style={{ marginBottom: '8px' }}
        >
          <ChevronDown size={28} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
        </motion.div>
        <span style={{ fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Scroll To Explore
        </span>
      </div>
    </section>
  );
}

function StatCard({ value, label, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.05, borderColor: 'rgba(161, 168, 92, 0.6)', backgroundColor: 'rgba(30, 30, 30, 0.95)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={onClick}
      style={{
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        padding: '16px 24px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '120px'
      }}
    >
      <span style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>
        {value}
      </span>
      <span style={{ fontSize: '0.75rem', color: '#a1a85c', fontWeight: '600', letterSpacing: '1px' }}>
        {label}
      </span>
    </motion.div>
  );
}
