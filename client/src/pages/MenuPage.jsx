import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MealCard from '../components/ScrollRevealMenu/MealCard';
import SectionHeading from '../components/common/SectionHeading';
import Footer from '../components/Footer/Footer';
import PamphletMenu from '../components/PamphletMenu/PamphletMenu';
import { useCart } from '../components/Cart/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiGetUserOrders } from '../utils/api';
import foodBowl from '../assets/images/food-bowl.png';
import styles from './MenuPage.module.css';
import { allMenuItems, categories } from '../data/menuData';

const MenuPage = () => {
  const [vegOnly, setVegOnly] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'pamphlet'
  const { addItem } = useCart();
  const { user, token } = useAuth();
  const [pastOrders, setPastOrders] = useState([]);
  // Fetch past orders if user is logged in
  useEffect(() => {
    if (user && token) {
      apiGetUserOrders(token).then(orders => setPastOrders(orders)).catch(console.error);
    }
  }, [user, token]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.15 + 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const scrollToCategory = (category) => {
    const el = document.getElementById(`category-${category.replace(/\s+/g, '-')}`);
    if (el) {
      // Offset for sticky nav if needed
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePamphletItemClick = (item) => {
    setViewMode('cards');
    setTimeout(() => {
      const el = document.getElementById(`meal-${item.id}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        scrollToCategory(item.category);
      }
    }, 600);
  };

  // Derive suggestion sections
  const computeSuggestions = () => {
    if (!user || pastOrders.length === 0) return { buyAgain: [], recommended: [] };
    
    // Extract unique item IDs ordered previously
    const orderedItemIds = new Set();
    const orderedCategories = new Set();
    
    pastOrders.forEach(order => {
      order.items.forEach(item => {
        const id = item.menuItem || item.id;
        orderedItemIds.add(id);
        
        const fullItem = allMenuItems.find(m => m.id === id);
        if (fullItem) orderedCategories.add(fullItem.category);
      });
    });

    // Buy again items
    const buyAgain = allMenuItems.filter(item => orderedItemIds.has(item.id));
    
    // Recommended items: from categories they've ordered, but haven't ordered yet
    let recommended = allMenuItems.filter(item => 
      orderedCategories.has(item.category) && !orderedItemIds.has(item.id)
    );
    
    // Fallback: If no recommendations based on category, suggest other popular items (just take first few they haven't tried)
    if (recommended.length === 0) {
      recommended = allMenuItems.filter(item => !orderedItemIds.has(item.id)).slice(0, 4);
    }

    return { buyAgain: buyAgain.slice(0, 4), recommended: recommended.slice(0, 4) };
  };

  const { buyAgain, recommended } = computeSuggestions();

  return (
    <>
      <main className={styles.menuPage}>
        <motion.div 
          className={styles.menuHero}
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          <SectionHeading 
            label="Our Menu" 
            heading="Nourish your body, fuel your day." 
            italicWord="fuel" 
            align="center" 
          />
        </motion.div>

        <motion.div 
          className={styles.viewToggleContainer}
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'cards' ? styles['toggleBtn--active'] : ''}`}
              onClick={() => setViewMode('cards')}
            >
              Menu Cards
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'pamphlet' ? styles['toggleBtn--active'] : ''}`}
              onClick={() => setViewMode('pamphlet')}
            >
              Digital Pamphlet
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={viewMode}
            className={styles.menuContent}
            custom={2}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -15, transition: { duration: 0.2 } }}
            variants={fadeUpVariants}
          >
            {viewMode === 'cards' ? (
            <>
              <div className={styles.filterBar}>
                <div className={styles.tabs}>
                  {categories.map(c => (
                    <button 
                      key={c} 
                      className={styles.tab} 
                      onClick={() => scrollToCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <label className={styles.vegToggle}>
                  <input type="checkbox" checked={vegOnly} onChange={() => setVegOnly(!vegOnly)} />
                  <span className={styles.vegLabel}>Veg Only</span>
                </label>
              </div>

              <div className={styles.menuSections}>
                <AnimatePresence>
                  {user && buyAgain.length > 0 && !vegOnly && (
                    <motion.section 
                      key="buy-again"
                      className={styles.suggestionSection}
                      initial={{ opacity: 0, height: 0, paddingBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', paddingBottom: '2rem' }}
                      exit={{ opacity: 0, height: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <h2 className={styles.suggestionHeading}>Buy Again ↺</h2>
                      <div className={styles.menuGrid}>
                        {buyAgain.map(meal => (
                          <MealCard key={meal.id} meal={meal} onAddToCart={addItem} />
                        ))}
                      </div>
                    </motion.section>
                  )}

                  {user && recommended.length > 0 && !vegOnly && (
                    <motion.section 
                      key="recommended"
                      className={styles.suggestionSection}
                      initial={{ opacity: 0, height: 0, paddingBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', paddingBottom: '2rem' }}
                      exit={{ opacity: 0, height: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <h2 className={styles.suggestionHeading}>Recommended for You ✨</h2>
                      <div className={styles.menuGrid}>
                        {recommended.map(meal => (
                          <MealCard key={meal.id} meal={meal} onAddToCart={addItem} />
                        ))}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {categories.map(category => {
                  let items = allMenuItems.filter(m => m.category === category);
                  if (vegOnly) items = items.filter(m => m.isVeg);

                  if (items.length === 0) return null;

                  return (
                    <section 
                      key={category} 
                      id={`category-${category.replace(/\s+/g, '-')}`} 
                      className={styles.categorySection}
                    >
                      <h2 className={styles.categoryHeading}>{category}</h2>
                      <div className={styles.menuGrid}>
                        {items.map(meal => (
                          <MealCard key={meal.id} meal={meal} onAddToCart={addItem} id={`meal-${meal.id}`} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          ) : (
            <PamphletMenu items={allMenuItems} onItemClick={handlePamphletItemClick} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
};

export default MenuPage;
