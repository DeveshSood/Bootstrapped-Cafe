import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MealCard from '../components/ScrollRevealMenu/MealCard';
import SectionHeading from '../components/common/SectionHeading';
import Footer from '../components/Footer/Footer';
import PamphletMenu from '../components/PamphletMenu/PamphletMenu';
import { useCart } from '../components/Cart/CartContext';
import SlotCounter from '../components/common/SlotCounter';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiGetUserOrders, apiGetDailyMenu } from '../utils/api';
import foodBowl from '../assets/images/food-bowl.png';
import liquidRootsLogo from '../assets/images/Liquid Roots Logo.png';
import { allMenuItems as staticMenuItems } from '../data/menuData';
import styles from './MenuPage.module.css';
import scrollStyles from '../components/ScrollRevealMenu/ScrollRevealMenu.module.css';

const MarqueeText = ({ text, className, style }) => {
  const containerRef = React.useRef(null);
  const textRef = React.useRef(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    if (containerRef.current && textRef.current) {
      setIsOverflowing(textRef.current.scrollWidth > containerRef.current.clientWidth);
    }
  }, [text]);

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', WebkitMaskImage: isOverflowing ? 'linear-gradient(to right, black 85%, transparent 100%)' : 'none' }}>
      <h4 
        ref={textRef}
        className={`${className} ${isOverflowing ? scrollStyles.marqueeScroll : ''}`}
        style={{ ...style, display: 'inline-block', whiteSpace: 'nowrap' }}
      >
        {text}
        {isOverflowing && <span style={{ paddingLeft: '40px' }}>{text}</span>}
      </h4>
    </div>
  );
};

const MenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vegOnly, setVegOnly] = useState(false);
  const [viewMode, setViewMode] = useState(location.state?.viewMode || 'bowls');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);
  const { items, addItem, updateQuantity } = useCart();
  const { user, token, deleteCustomBowl, saveCustomBowl, updateCustomBowl } = useAuth();
  const { showToast } = useToast();
  const [pastOrders, setPastOrders] = useState([]);

  // Dynamic daily menu state
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [timeToNextMenu, setTimeToNextMenu] = useState('');
  const [testDate, setTestDate] = useState('');

  const categorizeIngredients = (ingredients) => {
    if (!ingredients || !Array.isArray(ingredients)) return {};
    const categories = {
      'Protein': [],
      'Curry of the day': [],
      'Salads': [],
      'Phytos': [],
      'Complex Carbs': [],
      'Base & Toppings': []
    };
    
    ingredients.forEach(ing => {
      const lower = ing.toLowerCase();
      if (lower.includes('chicken') || lower.includes('paneer') || lower.includes('egg') || lower.includes('tofu') || lower.includes('fish')) {
        categories['Protein'].push(ing);
      } else if (lower.includes('rice') || lower.includes('quinoa') || lower.includes('millets') || lower.includes('oats')) {
        categories['Complex Carbs'].push(ing);
      } else if (lower.includes('dal') || lower.includes('rajma') || lower.includes('chana') || lower.includes('chickpea') || lower.includes('curry') || lower.includes('stew')) {
        categories['Curry of the day'].push(ing);
      } else if (lower.includes('salsa') || lower.includes('salad') || lower.includes('hummus') || lower.includes('beans') || lower.includes('cucumber') || lower.includes('lettuce') || lower.includes('tomato') || lower.includes('onion') || lower.includes('cabbage')) {
        categories['Salads'].push(ing);
      } else if (lower.includes('broccoli') || lower.includes('capsicum') || lower.includes('zucchini') || lower.includes('carrot') || lower.includes('cauliflower') || lower.includes('mushroom') || lower.includes('bhindi') || lower.includes('gobi') || lower.includes('bell pepper') || lower.includes('bellpeper') || lower.includes('bellpeppers')) {
        categories['Phytos'].push(ing);
      } else {
        categories['Base & Toppings'].push(ing);
      }
    });
    
    const result = {};
    for (const [key, value] of Object.entries(categories)) {
      if (value.length > 0) result[key] = value;
    }
    return result;
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        const data = await apiGetDailyMenu(testDate || null);
        const mergedItems = (data.menuItems || []).map(backendItem => {
          const frontendItem = staticMenuItems.find(i => i.id === backendItem.id);
          return {
            ...backendItem,
            image: frontendItem ? frontendItem.image : null
          };
        });
        setAllMenuItems(mergedItems);
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to load daily menu:", err);
        showToast("Failed to load daily menu", "error");
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [showToast, testDate]);

  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      const dateObj = testDate ? new Date(testDate) : now;
      const dayNum = dateObj.getDay();
      
      // Sunday (0) and Saturday (6) are closed
      if (dayNum === 0 || dayNum === 6) {
        setTimeToNextMenu('Closed Today');
        return;
      }
      
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0); // Midnight tonight
      const diff = tomorrow - now;
      
      if (diff <= 0) {
        window.location.reload();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeToNextMenu(`${hours}h ${mins}m ${secs}s`);
      }
    };
    
    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user && token) {
      apiGetUserOrders(token).then(orders => setPastOrders(orders)).catch(console.error);
    }
  }, [user, token]);

  useEffect(() => {
    if (location.state?.viewMode) {
      setViewMode(location.state.viewMode);
      if (location.state.category) {
        setTimeout(() => scrollToCategory(location.state.category), 300);
      }
      // Clean up state so refresh doesn't force this viewMode
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

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

      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePamphletItemClick = (item) => {
    const isDrink = ['Smoothies', 'Home brewed drinks'].includes(item.category);
    setViewMode(isDrink ? 'drinks' : 'bowls');
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


  const computeSuggestions = () => {
    if (!user || pastOrders.length === 0) return { buyAgain: [], recommended: [] };
    

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


    const buyAgain = allMenuItems.filter(item => orderedItemIds.has(item.id));
    

    let recommended = allMenuItems.filter(item => 
      orderedCategories.has(item.category) && !orderedItemIds.has(item.id)
    );
    

    if (recommended.length === 0) {
      recommended = allMenuItems.filter(item => !orderedItemIds.has(item.id)).slice(0, 4);
    }

    return { buyAgain: buyAgain.slice(0, 4), recommended: recommended.slice(0, 4) };
  };

  const { buyAgain, recommended } = computeSuggestions();

  const handleModalAddToCart = () => {
    if (!selectedItem) return;
    if (selectedItem.isCustomBowl || selectedItem.customIngredients) {
      const customIngs = {};
      if (selectedItem.customIngredients) {
        Object.keys(selectedItem.customIngredients).forEach(key => {
          customIngs[key] = [...selectedItem.customIngredients[key]];
        });
      }
      addItem({
        id: 'custom-bowl-' + Date.now(),
        name: selectedItem.name,
        price: selectedItem.price,
        image: foodBowl,
        quantity: 1,
        isCustomBowl: true,
        customIngredients: customIngs
      });
      showToast(`${selectedItem.name} added to cart!`, 'success');
    } else {
      addItem(selectedItem);
      showToast(`${selectedItem.name} added to cart!`, 'success');
    }
    setSelectedItem(null);
  };

  const handleDeleteSavedBowl = async () => {
    if (!selectedItem) return;
    try {
      await deleteCustomBowl(selectedItem._id);
      showToast('Bowl removed from saved list.', 'success');
      setSelectedItem(null);
    } catch (err) {
      showToast('Failed to delete bowl.', 'error');
    }
  };

  const handleRenameSavedBowl = async () => {
    if (!selectedItem || !editNameValue.trim() || editNameValue === selectedItem.name) {
      setIsEditingName(false);
      return;
    }
    
    const currentItem = selectedItem;
    const newName = editNameValue.trim();
    
    // Close modal immediately to prevent double-clicks
    setSelectedItem(null);
    setIsEditingName(false);
    
    try {
      await updateCustomBowl(currentItem._id, { name: newName });
      showToast('Bowl renamed successfully!', 'success');
    } catch (err) {
      showToast('Failed to rename bowl.', 'error');
    }
  };

  const bowlCategories = ['Mini Bowls', 'Healthy Finger Bites', 'Healthy Bowls'];
  const drinkCategories = ['Smoothies', 'Home brewed drinks'];
  const currentCategories = viewMode === 'bowls' ? bowlCategories : drinkCategories;



  const handleTestDayChange = (e) => {
    setTestDate(e.target.value);
  };

  const isWeekend = testDate ? (new Date(testDate).getUTCDay() === 0 || new Date(testDate).getUTCDay() === 6) : (new Date().getDay() === 0 || new Date().getDay() === 6);

  const customLabel = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
      <span style={{ 
        fontFamily: 'var(--font-body)', fontSize: 'var(--fs-label)', fontWeight: 600, 
        textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--terracotta)' 
      }}>
        Our Menu
      </span>
      {isWeekend ? (
        <div style={{
          backgroundColor: 'var(--terracotta)', color: 'white', padding: '6px 16px',
          borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <span>⛔ Closed on Weekends (No Checkout)</span>
        </div>
      ) : timeToNextMenu && (
        <div style={{
          backgroundColor: 'var(--forest-green)', color: 'white', padding: '6px 16px',
          borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <span>🕒 Daily Menu changes in: {timeToNextMenu}</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--espresso-soft)', fontWeight: 600 }}>TEST OVERRIDE:</span>
        <select 
          value={testDate} 
          onChange={handleTestDayChange}
          style={{
            padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-light)',
            fontSize: '0.8rem', background: 'white', color: 'var(--espresso)', cursor: 'pointer'
          }}
        >
          <option value="">Today (Default)</option>
          <option value="2024-01-01">Monday</option>
          <option value="2024-01-02">Tuesday</option>
          <option value="2024-01-03">Wednesday</option>
          <option value="2024-01-04">Thursday</option>
          <option value="2024-01-05">Friday</option>
          <option value="2024-01-06">Saturday</option>
          <option value="2024-01-07">Sunday</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      <main className={styles.menuPage}>

        {loadingMenu ? (
          <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-dark)', fontSize: '1.2rem' }}>
            Loading today's menu...
          </div>
        ) : (
          <>
            <motion.div 

          className={styles.menuHero}
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          <SectionHeading 
            label={customLabel}
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
              className={`${styles.toggleBtn} ${viewMode === 'bowls' ? styles['toggleBtn--active'] : ''}`}
              onClick={() => setViewMode('bowls')}
            >
              Bowls
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'drinks' ? styles['toggleBtn--active'] : ''}`}
              onClick={() => setViewMode('drinks')}
            >
              Drinks
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'custom' ? styles['toggleBtn--active'] : ''}`}
              onClick={() => setViewMode('custom')}
            >
              Custom Bowl
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
            {(viewMode === 'bowls' || viewMode === 'drinks') ? (
            <>
              <div className={styles.filterBar}>
                <div className={styles.tabs}>
                  {currentCategories.map(c => (
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
                {viewMode === 'drinks' && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    padding: '2rem',
                    background: 'var(--white)',
                    borderRadius: '24px',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <img 
                      src={liquidRootsLogo} 
                      alt="Liquid Roots" 
                      style={{ 
                        height: '80px', 
                        objectFit: 'contain', 
                        mixBlendMode: 'multiply' 
                      }} 
                    />
                    <div style={{ 
                      borderLeft: '2px solid rgba(0,0,0,0.1)', 
                      paddingLeft: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 4px 0', color: 'var(--espresso)', fontSize: '1.4rem' }}>
                        Liquid Roots Collection
                      </h3>
                      <p style={{ margin: 0, color: 'var(--espresso-soft)', fontSize: '0.95rem' }}>
                        Artisanal smoothies & kombucha crafted in-house.
                      </p>
                    </div>
                  </div>
                )}
                <AnimatePresence>
                  {user && buyAgain.length > 0 && !vegOnly && viewMode === 'bowls' && (
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
                          <MealCard key={meal.id} meal={meal} onDetailsClick={() => setSelectedItem(meal)} />
                        ))}
                      </div>
                    </motion.section>
                  )}

                  {user && recommended.length > 0 && !vegOnly && viewMode === 'bowls' && (
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
                          <MealCard key={meal.id} meal={meal} onDetailsClick={() => setSelectedItem(meal)} />
                        ))}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                  {currentCategories.map(category => {
                    const categoryItems = allMenuItems.filter(i => 
                      i.category === category && (!vegOnly || i.isVeg)
                    );
                    if (categoryItems.length === 0) return null;

                  return (
                    <section 
                      key={category} 
                      id={`category-${category.replace(/\s+/g, '-')}`} 
                      className={styles.categorySection}
                    >
                      <h2 className={styles.categoryHeading}>{category}</h2>
                      <div className={styles.menuGrid}>
                        {categoryItems.map(meal => (
                          <MealCard key={meal.id} meal={meal} onDetailsClick={() => setSelectedItem(meal)} id={`meal-${meal.id}`} isDrink={viewMode === 'drinks'} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          ) : viewMode === 'custom' ? (
            <div className={styles.menuSections}>
              <section className={styles.categorySection}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)'}}>
                  <h2 className={styles.categoryHeading} style={{marginBottom: 0}}>Your Saved Bowls</h2>
                  <button 
                    onClick={() => navigate('/custom-salad')}
                    style={{background: 'var(--forest-green)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'transform 0.2s'}}
                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  >
                    + Create New
                  </button>
                </div>
                <div className={styles.menuGrid}>
                  {user?.savedBowls?.length > 0 ? (
                    <AnimatePresence>
                      {user.savedBowls.filter(b => !deletingIds.includes(b._id)).map(bowl => (
                        <motion.div 
                          key={bowl._id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                          className={scrollStyles.mealCardWrapper} 
                          style={{
                            cursor: 'pointer', 
                            border: '2px solid transparent',
                            transition: 'border-color 0.3s ease',
                            borderRadius: '24px',
                            overflow: 'hidden'
                          }}
                          whileHover={{ borderColor: 'var(--forest-green)' }}
                          onClick={() => setSelectedItem({ ...bowl, isCustomBowl: true, image: foodBowl })}
                        >
                        <div className={scrollStyles.flipCardInner} style={{ transform: 'none' }}>
                          <div className={scrollStyles.flipCardFront}>
                            <div className={scrollStyles.mealCardTop}>
                              <div className={scrollStyles.mealImageContainer}>
                                <img src={foodBowl} alt="Custom Bowl" className={scrollStyles.mealImage} />
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (confirmDeleteId === bowl._id) {
                                      setDeletingIds(prev => [...prev, bowl._id]);
                                      try {
                                        await deleteCustomBowl(bowl._id);
                                        showToast('Bowl removed from saved list.', 'success');
                                        setConfirmDeleteId(null);
                                      } catch (err) {
                                        showToast('Failed to delete bowl.', 'error');
                                        setDeletingIds(prev => prev.filter(id => id !== bowl._id));
                                      }
                                    } else {
                                      setConfirmDeleteId(bowl._id);
                                      setTimeout(() => setConfirmDeleteId(prev => prev === bowl._id ? null : prev), 3000);
                                    }
                                  }}
                                  style={{ position: 'absolute', top: '12px', left: '12px', background: confirmDeleteId === bowl._id ? 'var(--terracotta)' : 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', color: confirmDeleteId === bowl._id ? 'white' : 'var(--terracotta)', fontSize: confirmDeleteId === bowl._id ? '1rem' : '0.9rem', zIndex: 10, transition: 'all 0.2s' }}
                                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                  title={confirmDeleteId === bowl._id ? "Confirm Delete" : "Delete Bowl"}
                                >
                                  {confirmDeleteId === bowl._id ? '✓' : '✖'}
                                </button>
                              </div>
                              <div className={scrollStyles.mealPromoBar}>Custom Creation</div>
                            </div>
                            <div className={scrollStyles.mealFrontDetails}>
                              <div className={scrollStyles.mealFrontDetailsLeft} style={{minWidth: 0, overflow: 'hidden'}}>
                                <MarqueeText text={bowl.name} className={scrollStyles.mealTitle} style={{fontSize: '1.2rem', marginBottom: 0}} />
                                <span style={{fontSize: '0.85rem', color: 'var(--forest-green)', display: 'block', marginTop: '4px', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Click for details ↗</span>
                              </div>
                              <div className={scrollStyles.mealFrontDetailsDivider}></div>
                              <div className={scrollStyles.mealFrontDetailsRight} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', minWidth: '70px'}}>
                                <div className={scrollStyles.mealPriceBox} style={{lineHeight: '1'}}>₹{bowl.price}</div>
                                <motion.button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const customIngs = {};
                                    if (bowl.customIngredients) {
                                      Object.keys(bowl.customIngredients).forEach(key => {
                                        customIngs[key] = [...bowl.customIngredients[key]];
                                      });
                                    }
                                    addItem({
                                      id: 'custom-bowl-' + Date.now(),
                                      name: bowl.name,
                                      price: bowl.price,
                                      image: foodBowl,
                                      quantity: 1,
                                      isCustomBowl: true,
                                      customIngredients: customIngs
                                    });
                                    showToast(`${bowl.name} added to cart!`, 'success');
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  style={{padding: '6px 16px', background: 'var(--forest-green)', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '0.9rem'}}
                                >Add</motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <div style={{gridColumn: '1 / -1', padding: 'var(--space-3xl) var(--space-xl)', textAlign: 'center', background: 'var(--cream-light)', borderRadius: '24px', border: '2px dashed var(--border-light)'}}>
                      <h3 style={{fontFamily: 'var(--font-display)', color: 'var(--espresso)', marginBottom: 'var(--space-sm)'}}>No saved bowls yet</h3>
                      <p style={{color: 'var(--espresso-soft)', marginBottom: 'var(--space-lg)'}}>You haven't created any custom bowls. Mix and match your favorite ingredients!</p>
                      <button 
                        onClick={() => navigate('/custom-salad')}
                        style={{background: 'var(--forest-green)', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem'}}
                      >
                        Build Your First Bowl
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <PamphletMenu items={allMenuItems} onItemClick={handlePamphletItemClick} />
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.2}}
              style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md)', willChange: 'opacity'}} 
              onClick={() => setSelectedItem(null)}
            >
              <motion.div 
                initial={{opacity: 0, y: 40, scale: 0.95}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, scale: 0.95, y: 20}}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                onClick={e => e.stopPropagation()}
                style={{background: 'var(--white)', borderRadius: '24px', width: '100%', maxWidth: '600px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', willChange: 'transform, opacity'}}
              >
                <div style={{position: 'relative', height: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '350px' : '150px', background: 'var(--cream-light)', overflow: 'hidden', flexShrink: 0}}>
                  <button onClick={() => { setSelectedItem(null); setIsEditingName(false); }} style={{position: 'absolute', top: '12px', right: '12px', background: 'var(--white)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10, fontWeight: 'bold'}}>×</button>
                  <motion.div
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    style={{width: '100%', height: '100%', willChange: 'transform'}}
                  >
                    <img src={selectedItem.image} alt={selectedItem.name} style={{width: '100%', height: '100%', objectFit: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? 'contain' : 'cover', padding: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '32px' : '0', mixBlendMode: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? 'multiply' : 'normal', willChange: 'transform', transform: 'translateZ(0)'}} />
                  </motion.div>
                  <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70%', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'}}></div>
                  <div style={{position: 'absolute', bottom: '16px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    
                    {isEditingName && (selectedItem.isCustomBowl || selectedItem.customIngredients) ? (
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', flex: 1, marginRight: '16px'}}>
                        <input 
                          type="text" 
                          value={editNameValue} 
                          onChange={e => setEditNameValue(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleRenameSavedBowl()}
                          autoFocus
                          style={{fontFamily: 'var(--font-display)', color: 'var(--espresso)', fontSize: '2rem', width: '100%', background: 'var(--white)', border: 'none', borderRadius: '8px', padding: '4px 8px', outline: 'none'}}
                        />
                        <button onClick={handleRenameSavedBowl} style={{background: 'var(--forest-green)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'}}>Save</button>
                      </div>
                    ) : (
                      <h2 style={{fontFamily: 'var(--font-display)', color: 'var(--white)', margin: 0, fontSize: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        {selectedItem.name} 
                        {(selectedItem.isCustomBowl || selectedItem.customIngredients) && (
                          <span onClick={() => { setIsEditingName(true); setEditNameValue(selectedItem.name); }} style={{fontSize: '1.2rem', cursor: 'pointer', opacity: 0.8}} title="Rename Bowl">✏️</span>
                        )}
                      </h2>
                    )}
                    
                    {!isEditingName && (
                      <div style={{fontWeight: 'bold', color: 'var(--white)', fontSize: '1.3rem', background: 'var(--forest-green)', padding: '2px 12px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)'}}>₹{selectedItem.price}</div>
                    )}
                  </div>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', overflowY: 'auto', flex: 1}}>
                  {/* Left Side: Ingredients & Description */}
                  <div style={{flex: '1 1 50%', minWidth: '250px', padding: 'var(--space-md)', borderRight: '1px solid var(--border-light)'}}>
                  
                  {(selectedItem.isCustomBowl || selectedItem.customIngredients) ? (
                    <>
                      <h4 style={{marginBottom: 'var(--space-sm)', color: 'var(--espresso-soft)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px'}}>Bowl Contents</h4>
                      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                        {[
                          { id: 'complexCarbs', label: 'Complex carbs' },
                          { id: 'protein', label: 'Protein' },
                          { id: 'phytos', label: 'Phytos' },
                          { id: 'curry', label: 'Curry of the day' },
                          { id: 'salads', label: 'Salads' },
                          { id: 'dressing', label: 'Dressing (home made)' }
                        ].map(cat => {
                          const items = (selectedItem.customIngredients && selectedItem.customIngredients[cat.id]) || [];
                          return (
                            <div key={cat.id}>
                              <span style={{display: 'block', textTransform: 'capitalize', fontWeight: 'bold', color: 'var(--espresso)', marginBottom: '4px', fontSize: '0.85rem'}}>{cat.label}</span>
                              <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                                {items.length > 0 ? (
                                  items.map((item, idx) => (
                                    <span key={idx} style={{background: 'var(--sage-light)', color: 'var(--forest-green)', padding: '4px 10px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '500'}}>
                                      {item}
                                    </span>
                                  ))
                                ) : (
                                  <span style={{color: 'var(--espresso-soft)', fontSize: '0.8rem', fontStyle: 'italic'}}>None</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      {selectedItem.ingredients && (
                        <div style={{marginBottom: 'var(--space-md)'}}>
                          <h4 style={{margin: '0 0 12px 0', color: 'var(--espresso)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px'}}>Bowl Ingredients</h4>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            {Object.entries(categorizeIngredients(selectedItem.ingredients)).map(([catName, items]) => (
                              <div key={catName}>
                                <span style={{display: 'block', fontWeight: 'bold', color: 'var(--forest-green)', marginBottom: '4px', fontSize: '0.85rem'}}>{catName}</span>
                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                                  {items.map((item, idx) => (
                                    <span key={idx} style={{background: 'var(--cream-light)', border: '1px solid var(--border-light)', color: 'var(--espresso-soft)', padding: '4px 10px', borderRadius: '16px', fontSize: '0.8rem'}}>
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedItem.description && (
                        <p style={{color: 'var(--espresso)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: 'var(--space-md)'}}>{selectedItem.description}</p>
                      )}
                      
                      {selectedItem.tags && selectedItem.tags.length > 0 && (
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-md)'}}>
                          {selectedItem.tags.map(tag => (
                            <span key={tag} style={{background: 'var(--sage-light)', color: 'var(--forest-green)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'}}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  </div>

                  {/* Right Side: Nutrition */}
                  <div style={{flex: '1 1 50%', minWidth: '250px', padding: 'var(--space-md)', background: '#F8FAFC'}}>
                    
                    {selectedItem.nutrition ? (
                      <div style={{marginBottom: 'var(--space-md)'}}>
                        <h4 style={{margin: '0 0 12px 0', color: 'var(--espresso)'}}>Nutritional Info</h4>
                        
                        <h5 style={{margin: '0 0 6px 0', color: 'var(--espresso-soft)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Macros</h5>
                        <div style={{ display: 'flex', flexDirection: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? 'row' : 'column', flexWrap: 'wrap', gap: '8px', fontSize: '0.85rem', color: 'var(--text-dark)', marginBottom: '16px' }}>
                          <div style={{display: 'flex', flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '1 1 45%' : '1', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.7)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0'}}>
                            <span><span style={{color: 'var(--terracotta)', fontWeight: 'bold'}}>🔥 Calories:</span></span> <span>{selectedItem.nutrition.calories || 0}kcal</span>
                          </div>
                          <div style={{display: 'flex', flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '1 1 45%' : '1', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.7)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0'}}>
                            <span><span style={{color: 'var(--forest-green)', fontWeight: 'bold'}}>🥩 Protein:</span></span> <span>{selectedItem.nutrition.protein || 0}g</span>
                          </div>
                          <div style={{display: 'flex', flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '1 1 45%' : '1', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.7)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0'}}>
                            <span><span style={{color: '#D4AF37', fontWeight: 'bold'}}>🌾 Carbs:</span></span> <span>{selectedItem.nutrition.carbs || 0}g</span>
                          </div>
                          <div style={{display: 'flex', flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '1 1 45%' : '1', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.7)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0'}}>
                            <span><span style={{color: 'var(--espresso-soft)', fontWeight: 'bold'}}>🥑 Fat:</span></span> <span>{selectedItem.nutrition.fat || 0}g</span>
                          </div>
                        </div>
                        
                        <h5 style={{margin: '12px 0 6px 0', color: 'var(--espresso-soft)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Vitamins & Minerals</h5>
                        <div style={{ display: 'flex', flexDirection: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? 'row' : 'column', flexWrap: 'wrap', gap: '8px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                          <div style={{display: 'flex', flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '1 1 45%' : '1', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.7)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0'}}>
                            <span><span style={{color: 'var(--terracotta)', fontWeight: 'bold'}}>💊 Vit C:</span></span> <span>{selectedItem.nutrition.vitC || 0}mg</span>
                          </div>
                          <div style={{display: 'flex', flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '1 1 45%' : '1', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.7)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0'}}>
                            <span><span style={{color: 'var(--forest-green)', fontWeight: 'bold'}}>💊 Vit E:</span></span> <span>{selectedItem.nutrition.vitE || 0}mg</span>
                          </div>
                          <div style={{display: 'flex', flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '1 1 45%' : '1', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.7)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0'}}>
                            <span><span style={{color: '#D4AF37', fontWeight: 'bold'}}>💊 Folate:</span></span> <span>{selectedItem.nutrition.folate || 0}mcg</span>
                          </div>
                          <div style={{display: 'flex', flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '1 1 45%' : '1', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.7)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0'}}>
                            <span><span style={{color: 'var(--espresso-soft)', fontWeight: 'bold'}}>💊 Vit B6:</span></span> <span>{selectedItem.nutrition.vitB6 || 0}mg</span>
                          </div>
                        </div>
                      </div>
                    ) : (selectedItem.isCustomBowl || selectedItem.customIngredients) ? (
                      <div style={{marginBottom: 'var(--space-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--espresso-soft)', textAlign: 'center'}}>
                        <span style={{fontSize: '2rem', marginBottom: '12px'}}>🥗</span>
                        <p style={{fontSize: '0.9rem', fontStyle: 'italic', maxWidth: '200px'}}>Edit and save this bowl to generate its nutritional information!</p>
                      </div>
                    ) : null}
                    
                  </div>
                </div>


                  <div style={{padding: 'var(--space-md)', background: 'var(--white)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 'var(--space-sm)', flexShrink: 0}}>
                    {(selectedItem.isCustomBowl || selectedItem.customIngredients) && (
                      <>
                        <button 
                          onClick={handleDeleteSavedBowl}
                          style={{padding: '12px', background: 'var(--white)', border: '2px solid var(--terracotta)', borderRadius: '30px', color: 'var(--terracotta)', fontWeight: 'bold', cursor: 'pointer', flex: '0 0 auto', width: '100px', transition: 'all 0.2s', fontSize: '0.9rem'}}
                          onMouseOver={e => {e.target.style.background='var(--terracotta)'; e.target.style.color='var(--white)';}}
                          onMouseOut={e => {e.target.style.background='var(--white)'; e.target.style.color='var(--terracotta)';}}
                        >Delete</button>
                        <button 
                          onClick={() => navigate('/custom-salad', { state: { editBowlData: selectedItem } })}
                          style={{padding: '12px', background: 'var(--white)', border: '2px solid var(--forest-green)', borderRadius: '30px', color: 'var(--forest-green)', fontWeight: 'bold', cursor: 'pointer', flex: '0 0 auto', transition: 'all 0.2s', fontSize: '0.9rem'}}
                          onMouseOver={e => {e.target.style.background='var(--sage-light)'}}
                          onMouseOut={e => {e.target.style.background='var(--white)'}}
                        >Edit Bowl</button>
                      </>
                    )}
                    {(() => {
                      const itemId = selectedItem.id || selectedItem._id;
                      const cartItem = items.find(i => (i.id === itemId || i._id === itemId));
                      const quantity = cartItem ? cartItem.quantity : 0;
                      
                      const handleIncrease = (e) => {
                        e.stopPropagation();
                        if (quantity === 0) {
                          addItem(selectedItem);
                          showToast(`${selectedItem.name} added to cart!`);
                        } else {
                          updateQuantity(itemId, quantity + 1);
                        }
                      };

                      const handleDecrease = (e) => {
                        e.stopPropagation();
                        if (quantity > 0) {
                          updateQuantity(itemId, quantity - 1);
                        }
                      };

                      return quantity === 0 ? (
                        <button
                          className={scrollStyles.mealOrderBtn}
                          onClick={handleIncrease}
                          style={{ 
                            flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '0 0 auto' : 1, 
                            margin: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '0 auto' : '0',
                            height: '45px', 
                            borderRadius: '30px',
                            minWidth: '150px'
                          }}
                        >
                          <span className={scrollStyles.mealOrderBtnIcon}>🛒</span>
                          <span className={scrollStyles.mealOrderBtnText}>Add to Cart</span>
                        </button>
                      ) : (
                        <div className={scrollStyles.mealQuantityControl} style={{ 
                          height: '45px', 
                          borderRadius: '30px', 
                          flex: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '0 0 auto' : 1,
                          margin: (selectedItem.category === 'Drinks' || selectedItem.category === 'Home brewed drinks') ? '0 auto' : '0',
                          minWidth: '150px',
                          justifyContent: 'space-between',
                          padding: '0 8px'
                        }}>
                          <button className={scrollStyles.mqBtn} onClick={handleDecrease} style={{fontSize: '1.2rem', padding: '0 15px'}}>−</button>
                          <SlotCounter value={quantity} className={scrollStyles.mqCount} prefix="" />
                          <button className={scrollStyles.mqBtn} onClick={handleIncrease} style={{fontSize: '1.2rem', padding: '0 15px'}}>+</button>
                        </div>
                      );
                    })()}
                  </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default MenuPage;
