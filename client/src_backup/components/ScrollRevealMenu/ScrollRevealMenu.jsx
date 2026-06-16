import React, { useState, useRef, useEffect } from 'react';
import anime from 'animejs';
import MealCard from './MealCard';
import SectionHeading from '../common/SectionHeading';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import foodBowl from '../../assets/images/food-bowl.png';
import styles from './ScrollRevealMenu.module.css';

const categories = [
  'All',
  'Protein Bowls',
  'Vegan Bowls',
  'High Protein',
  'Office Lunch',
  'Kombucha',
];

const menuItems = [
  {
    id: 1, name: 'Teriyaki Salmon Bowl', category: 'Protein Bowls',
    description: 'Grilled salmon with quinoa, avocado, edamame, roasted veggies and miso dressing.',
    price: 549, calories: 520, protein: 42, carbs: 48, fat: 18,
    tags: ['High Protein'], isVeg: false, image: foodBowl,
  },
  {
    id: 2, name: 'Paneer Harvest Bowl', category: 'Vegan Bowls',
    description: 'Grilled paneer with sweet potato, chickpeas, kale, and tahini drizzle.',
    price: 399, calories: 460, protein: 28, carbs: 52, fat: 14,
    tags: ['Fresh Daily'], isVeg: true, image: foodBowl,
  },
  {
    id: 3, name: 'Grilled Chicken Plate', category: 'High Protein',
    description: 'Herb-marinated chicken breast with brown rice, steamed broccoli, and tzatziki.',
    price: 479, calories: 580, protein: 48, carbs: 42, fat: 16,
    tags: ['High Protein'], isVeg: false, image: foodBowl,
  },
  {
    id: 4, name: 'Mediterranean Lunch Box', category: 'Office Lunch',
    description: 'Hummus, falafel, tabbouleh, pita, olives, and feta cheese.',
    price: 429, calories: 510, protein: 22, carbs: 56, fat: 20,
    tags: ['Fresh Daily'], isVeg: true, image: foodBowl,
  },
  {
    id: 5, name: 'Citrus Kombucha', category: 'Kombucha',
    description: 'House-brewed orange and ginger kombucha with live cultures.',
    price: 179, calories: 45, protein: 0, carbs: 10, fat: 0,
    tags: ['Low Carb'], isVeg: true, image: foodBowl,
  },
  {
    id: 6, name: 'Steak & Quinoa Power', category: 'High Protein',
    description: 'Grass-fed steak strips with quinoa, roasted peppers, and chimichurri.',
    price: 649, calories: 620, protein: 52, carbs: 38, fat: 22,
    tags: ['High Protein'], isVeg: false, image: foodBowl,
  },
];

const ScrollRevealMenu = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const cardsRef = useRef(null);

  const filtered = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(m => m.category === activeCategory);

  useEffect(() => {
    if (isVisible && cardsRef.current) {
      anime({
        targets: cardsRef.current.querySelectorAll('[data-meal-card]'),
        opacity: [0, 1],
        translateY: [60, 0],
        scale: [0.9, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(100, { start: 200 }),
      });
    }
  }, [isVisible, activeCategory]);

  return (
    <section className={styles.scrollSection} ref={sectionRef} id="scroll-menu">
      <div className={styles.scrollHeader}>
        <SectionHeading
          label="Our Menu"
          heading="Fuel your day with intention."
          italicWord="intention."
          description="Every bowl, plate, and drink is crafted to nourish your body and fuel your focus."
          align="center"
        />
        <div className={styles.categoryTabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryTab} ${activeCategory === cat ? styles['categoryTab--active'] : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mealGrid} ref={cardsRef}>
        {filtered.map((meal) => (
          <div key={meal.id} data-meal-card>
            <MealCard meal={meal} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScrollRevealMenu;
