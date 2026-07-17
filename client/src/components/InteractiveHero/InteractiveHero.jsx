import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Callout from './Callout';
import Button from '../common/Button';
import homeBaseImg from '../../assets/images/Home base image.png';
import cwImg2 from '../../assets/images/CAFE 2.png';
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

const coworkingCalloutData = [
  {
    id: 'focus-pods',
    title: 'Focus Pods',
    description: 'Ideal for individual deep work and privacy.',
    side: 'left',
    icon: 'Monitor',
    textPos: { top: '50%', left: '74%' },
    dotPos: { top: '38%', left: '59%' },
    lineTarget: { x: 'calc(74% - 140px)', y: 'calc(50% - 15px)' },
    menuState: { viewMode: 'coworking' }
  },
  {
    id: 'meeting-pods',
    title: 'Meeting Pods',
    description: 'Perfect for collaborative sessions and team calls.',
    side: 'left',
    icon: 'Users',
    textPos: { top: '70%', left: '21%' },
    dotPos: { top: '48%', left: '13%' },
    lineTarget: { x: 'calc(21% - 100px)', y: 'calc(70% - 30px)' },
    menuState: { viewMode: 'coworking' }
  }
];

export default function InteractiveHero({ isLoaded = true }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [heroMode, setHeroMode] = useState('food'); // 'food' or 'coworking'
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = React.useRef(null);
  const navigate = useNavigate();

  const handleCalloutHover = (id) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredId(id);
  };

  const handleCalloutLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredId(null);
    }, 150);
  };

  // Sync heroMode with Navbar
  useEffect(() => {
    const handleSet = (e) => {
      setHeroMode(e.detail);
    };
    window.addEventListener('setHeroMode', handleSet);
    return () => window.removeEventListener('setHeroMode', handleSet);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('heroModeChange', { detail: heroMode }));
  }, [heroMode]);

  // Auto-switch mode every 7 seconds, unless scrolled or hovered
  useEffect(() => {
    if (isHovering || hoveredId !== null) return;
    const modeTimer = setInterval(() => {
      if (window.scrollY < 100) {
        setHeroMode(prev => {
          const next = prev === 'food' ? 'coworking' : 'food';
          return next;
        });
      }
    }, 7000);
    return () => clearInterval(modeTimer);
  }, [isHovering, hoveredId, heroMode]);

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
        <img src={cwImg2} alt="preload" />
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
                filter: hoveredId ? 'brightness(0.4)' : 'brightness(0.7)',
                transition: 'filter 0.3s ease'
              }}
            />

            {/* Top Left Typography */}
            <div style={{
              position: 'absolute',
              top: '18%', // Moved up from 25%
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
                  marginTop: '-15px', // Eased the negative margin since the whole container is higher
                  width: '100%',
                  color: '#f5d061', // soft golden yellow
                  fontSize: '0.85rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  marginBottom: '28px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.9)'
                }}
              >
                The Gourmet Lunch, Bold Flavors, Clean Nutrition at its best on MG Road
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                style={{
                  position: 'relative',
                  marginTop: '-15px', // Move the H1 up as well
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
                onHover={() => handleCalloutHover(callout.id)}
                onLeave={handleCalloutLeave}
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
            {/* Background Image */}
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${cwImg2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: hoveredId ? 'brightness(0.35)' : 'brightness(0.55)',
                transition: 'filter 0.3s ease'
              }}
            />

            {/* Dark overlay removed to rely on textShadow instead */}

            {/* Left Typography */}
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '8%',
              zIndex: 10,
              maxWidth: '650px',
              opacity: hoveredId ? 0.2 : 1,
              transition: 'opacity 0.3s ease'
            }}>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                style={{
                  color: '#f5d061',
                  fontSize: '0.85rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  marginBottom: '24px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.9)',
                  willChange: 'transform, opacity'
                }}
              >
                Work & Wellness Combined
              </motion.p>
              <h1
                style={{
                  position: 'relative',
                  width: 'max-content',
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '4.5rem',
                  lineHeight: '1.2',
                  margin: 0,
                  fontWeight: '700',
                  color: '#fff',
                  textShadow: '0 4px 15px rgba(0,0,0,0.9)',
                  willChange: 'transform, opacity'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
                >
                  Healthy food,
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.8, ease: 'easeOut' }}
                >
                  <span style={{ color: '#f5d061', fontStyle: 'italic', fontWeight: '400', textShadow: '0 4px 15px rgba(0,0,0,0.9)' }}>meets coworking.</span>
                </motion.div>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.1, ease: 'easeOut' }}
                style={{
                  marginTop: '32px',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: '500px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                  willChange: 'transform, opacity'
                }}
              >
                A premium coworking space designed for students, freelancers, and teams who value wellness as much as productivity.
              </motion.p>
            </div>

            {/* Bottom Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.4, ease: 'easeOut' }}
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
              <Button variant="filled" size="md" href="/coworking">
                Explore Subscriptions
              </Button>
              <Button variant="outlined-light" size="md" href="/contact">
                Book a Desk
              </Button>
            </motion.div>

            {/* Coworking Callouts */}
            {coworkingCalloutData.map((callout) => (
              <Callout
                key={callout.id}
                data={callout}
                isHovered={hoveredId === callout.id}
                isDimmed={hoveredId !== null && hoveredId !== callout.id}
                onHover={() => handleCalloutHover(callout.id)}
                onLeave={handleCalloutLeave}
                onClick={() => {
                  navigate('/coworking', { state: { scrollTo: callout.id } });
                }}
                isLoaded={isLoaded}
              />
            ))}

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
        <StatCard value="50% OFF" label="FIRST BOWL (12:30-3PM)" onClick={() => navigate('/menu')} />
        <StatCard value="100%" label="NON REPETITIVE MENUS" onClick={() => navigate('/menu')} />
        <StatCard value="5000+" label="TRUSTED CUSTOMERS" onClick={() => navigate('/about')} />
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
