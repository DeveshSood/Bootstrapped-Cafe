import React, { useRef, useCallback } from 'react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import ScrollReveal from '../common/ScrollReveal';
import { motion } from 'framer-motion';
import anime from 'animejs';
import styles from './Coworking.module.css';

const features = [
  { icon: '💻', title: 'Hot Desk', desc: 'Flexible seating with fast WiFi, charging ports, and calm ambience.', price: '₹299/day' },
  { icon: '🎓', title: 'Student Pass', desc: 'All-day access with a healthy snack, quiet booths, and power outlets.', price: '₹599/day' },
  { icon: '🍱', title: 'Team Lunch Plan', desc: 'Customized healthy lunches for your team, delivered to your meeting room.', price: '₹249/person' },
  { icon: '🔇', title: 'Private Workspace', desc: 'Silent booths and private rooms for focused work or small meetings.', price: '₹999/day' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const Coworking = () => {
  // 3D tilt effect on cards
  const handleMouseMove = useCallback((e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    anime({
      targets: cardEl,
      rotateY: x * 8,
      rotateX: -y * 8,
      duration: 300,
      easing: 'easeOutQuad',
    });
  }, []);

  const handleMouseLeave = useCallback((cardEl) => {
    if (!cardEl) return;
    anime({
      targets: cardEl,
      rotateY: 0,
      rotateX: 0,
      duration: 500,
      easing: 'easeOutQuad',
    });
  }, []);

  return (
    <section className={styles.coworking} id="coworking">
      <ScrollReveal animation="fadeUp" duration={800} threshold={0.15}>
        <div className={styles.coworkingInner}>
          <div className={styles.coworkingText}>
            <SectionHeading
              label="Work & Eat"
              heading="Where healthy food meets focused work."
              italicWord="focused"
              description="A coworking space designed for students, freelancers, and teams who value wellness as much as productivity."
            />
            <div className={styles.coworkingCtas}>
              <Button variant="filled" size="md">Book Workspace</Button>
              <Button variant="text" icon="→">Learn More</Button>
            </div>
          </div>

          <motion.div
            className={styles.featureGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={styles.featureCard}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 16px 32px rgba(200, 81, 45, 0.2)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
              >
                <div className={styles.glow} />
                <div className={styles.shimmerBorder} />
                <span className={styles.featureIcon}>{f.icon}</span>
                <h5 className={styles.featureTitle}>{f.title}</h5>
                <p className={styles.featureDesc}>{f.desc}</p>
                <span className={styles.featurePrice}>{f.price}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Coworking;

