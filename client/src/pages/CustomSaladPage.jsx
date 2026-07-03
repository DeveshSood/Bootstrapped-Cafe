import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import foodBowl from '../assets/images/food-bowl.png';
import { SALAD_CATEGORIES, INGREDIENTS } from '../data/ingredientsData';
import { useCart } from '../components/Cart/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { apiSaveCustomBowl } from '../utils/api';
import Button from '../components/common/Button';
import styles from './CustomSaladPage.module.css';

const BASE_PRICE = 149; // Default base price for a custom bowl

export default function CustomSaladPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { user, token, saveCustomBowl, updateCustomBowl } = useAuth();
  const toast = useToast();
  const previewEndRef = useRef(null);
  
  const editBowlData = location.state?.editBowlData;
  const [editingBowlId, setEditingBowlId] = useState(editBowlData?._id || null);

  const [activeTab, setActiveTab] = useState(SALAD_CATEGORIES[0].id);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bowlName, setBowlName] = useState(editBowlData?.name || 'My Custom Salad');

  // State structure: { base: [], essentials: [], ... }
  const [selections, setSelections] = useState(() => {
    const init = {};
    SALAD_CATEGORIES.forEach(c => init[c.id] = []);
    
    if (editBowlData && editBowlData.customIngredients) {
      Object.keys(editBowlData.customIngredients).forEach(catId => {
        const catArray = editBowlData.customIngredients[catId];
        const allItemsInCategory = INGREDIENTS[catId] || [];
        const reconstructedItems = [];
        
        if (Array.isArray(catArray)) {
          catArray.forEach(str => {
            let name = str;
            let count = 1;
            const match = str.match(/(.*)\s\(x(\d+)\)$/);
            if (match) {
              name = match[1].trim();
              count = parseInt(match[2], 10);
            }
            const foundItem = allItemsInCategory.find(i => i.name === name);
            if (foundItem) {
              for (let i = 0; i < count; i++) {
                reconstructedItems.push(foundItem);
              }
            }
          });
        }
        init[catId] = reconstructedItems;
      });
    }
    
    return init;
  });

  const handleAddItem = (categoryId, item) => {
    setSelections(prev => {
      const current = prev[categoryId];
      const categoryLimit = SALAD_CATEGORIES.find(c => c.id === categoryId).limit;
      if (current.length >= categoryLimit) {
        toast.error(`You can only select up to ${categoryLimit} items in this category.`);
        return prev;
      }
      
      // Auto-scroll the preview list when an item is added
      setTimeout(() => {
        previewEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
      
      return { ...prev, [categoryId]: [...current, item] };
    });
  };

  const handleRemoveItem = (categoryId, item) => {
    setSelections(prev => {
      const current = [...prev[categoryId]];
      const index = current.findIndex(i => i.id === item.id);
      if (index !== -1) {
        current.splice(index, 1);
      }
      return { ...prev, [categoryId]: current };
    });
  };

  const handleClearCategory = (categoryId) => {
    setSelections(prev => ({ ...prev, [categoryId]: [] }));
  };

  const totalPrice = useMemo(() => {
    let sum = BASE_PRICE;
    Object.values(selections).forEach(catArray => {
      catArray.forEach(item => sum += item.price);
    });
    return sum;
  }, [selections]);

  const totalNutrition = useMemo(() => {
    let macros = { protein: 0, carbs: 0, fat: 0, calories: 0 };
    Object.values(selections).forEach(catArray => {
      catArray.forEach(item => {
        if (item.nutrition) {
          macros.protein += item.nutrition.protein || 0;
          macros.carbs += item.nutrition.carbs || 0;
          macros.fat += item.nutrition.fat || 0;
          macros.calories += item.nutrition.calories || 0;
        }
      });
    });
    return macros;
  }, [selections]);

  const hasSelections = Object.values(selections).some(arr => arr.length > 0);

  const handleAddToCartClick = () => {
    if (!hasSelections) {
      toast.error('Please select some ingredients first!');
      return;
    }
    if (token) {
      setIsAddModalOpen(true);
    } else {
      performAddToCart();
    }
  };

  const performAddToCart = () => {
    const customIngredients = {};
    Object.keys(selections).forEach(key => {
      const itemsMap = {};
      selections[key].forEach(i => {
        itemsMap[i.name] = (itemsMap[i.name] || 0) + 1;
      });
      customIngredients[key] = Object.entries(itemsMap).map(([name, count]) => 
        count > 1 ? `${name} (x${count})` : name
      );
    });

    const cartItem = {
      id: 'custom-bowl-' + Date.now(),
      name: bowlName,
      price: totalPrice,
      image: foodBowl, 
      quantity: quantity,
      isCustomBowl: true,
      customIngredients: customIngredients
    };

    addItem(cartItem);
    toast.success('Custom salad added to cart!');
  };

  const handleSaveBowl = async () => {
    if (!token) return;
    if (!hasSelections) {
      toast.error('Select some ingredients to save.');
      return;
    }

    try {
      const customIngredients = {};
      Object.keys(selections).forEach(key => {
        const itemsMap = {};
        selections[key].forEach(i => {
          itemsMap[i.name] = (itemsMap[i.name] || 0) + 1;
        });
        customIngredients[key] = Object.entries(itemsMap).map(([name, count]) => 
          count > 1 ? `${name} (x${count})` : name
        );
      });

      if (editingBowlId) {
        await updateCustomBowl(editingBowlId, {
          name: bowlName,
          price: totalPrice,
          customIngredients
        });
      } else {
        const newSavedBowls = await saveCustomBowl({
          name: bowlName,
          price: totalPrice,
          customIngredients
        });
        if (newSavedBowls && newSavedBowls.length > 0) {
          setEditingBowlId(newSavedBowls[newSavedBowls.length - 1]._id);
        }
      }
      
      toast.success(editingBowlId ? 'Custom bowl updated successfully!' : 'Custom bowl saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save bowl');
    }
  };

  const handleSaveAndAddToCart = async () => {
    await handleSaveBowl();
    performAddToCart();
    setIsAddModalOpen(false);
  };

  const handleJustAddToCart = () => {
    performAddToCart();
    setIsAddModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* Left side content */}
      <div className={styles.mainContent}>
        
        {user?.savedBowls?.length > 0 && (
          <div style={{marginBottom: 'var(--space-xl)'}}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/menu', { state: { viewMode: 'custom' } })}
            >
              ← Back to Saved Bowls
            </Button>
          </div>
        )}

        {/* Header and Tabs */}
        <div className={styles.headerControls}>
          <div className={styles.tabs}>
            {SALAD_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.tab} ${activeTab === cat.id ? styles.active : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          <div className={styles.vegToggle} onClick={() => setIsVegOnly(!isVegOnly)}>
            <div className={`${styles.toggleSwitch} ${isVegOnly ? styles.active : ''}`}></div>
            <span>Veg Only</span>
          </div>
        </div>

        {/* Categories rendering */}
        {SALAD_CATEGORIES.map(cat => {
          if (cat.id !== activeTab) return null;
          
          let items = INGREDIENTS[cat.id];
          if (isVegOnly) {
            items = items.filter(i => i.isVeg);
          }

          const selectedCount = selections[cat.id].length;

          return (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={styles.categorySection}
            >
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>
                  <span style={{ color: 'var(--forest-green)' }}>*</span>{cat.label} 
                  <span className={styles.categoryLimit}>• {selectedCount}/{cat.limit}</span>
                </h3>
                <button className={styles.clearBtn} onClick={() => handleClearCategory(cat.id)}>
                  Clear
                </button>
              </div>

              <div className={styles.grid}>

                {items.map(item => {
                  const isSelected = selections[cat.id].some(i => i.id === item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={`${styles.ingredientCard} ${isSelected ? styles.selected : ''}`}
                      onClick={() => {
                        if (isSelected) {
                          setSelections(prev => ({
                            ...prev,
                            [cat.id]: prev[cat.id].filter(i => i.id !== item.id)
                          }));
                        } else {
                          handleAddItem(cat.id, item);
                        }
                      }}
                    >
                      <div className={item.isVeg ? styles.vegMark : styles.nonVegMark} title={item.isVeg ? 'Veg' : 'Non-Veg'}></div>
                      <div className={styles.cardIcon}>{item.image}</div>
                      <span className={styles.cardName}>{item.name}</span>
                      <span className={styles.cardPrice}>₹{item.price}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sidebar Preview */}
      <div className={styles.previewSidebar}>
        <div className={styles.previewHeader} style={{borderBottom: 'none', paddingBottom: 0}}>
          <input 
            type="text"
            value={bowlName}
            onChange={e => setBowlName(e.target.value)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              color: 'var(--espresso)',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px dashed var(--border-light)',
              width: '100%',
              textAlign: 'center',
              outline: 'none',
              paddingBottom: '4px'
            }}
          />
        </div>

        {!hasSelections ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🥗</div>
            <p>Choose what you want and we'll create just that for you</p>
          </div>
        ) : (
          <div className={styles.previewList}>
            <AnimatePresence>
              {SALAD_CATEGORIES.map(cat => {
                const items = selections[cat.id];
                if (items.length === 0) return null;
                return (
                  <motion.div 
                    key={cat.id}
                    className={styles.previewCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className={styles.previewCatTitle}>{cat.label}</div>
                    {Array.from(new Set(items.map(i => i.id))).map(id => {
                      const item = items.find(i => i.id === id);
                      const count = items.filter(i => i.id === id).length;
                      return (
                        <div key={item.id} className={styles.previewItem}>
                          <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                            <span>{item.name}</span>
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                              <button style={{background:'var(--espresso-soft)', color:'white', border:'none', borderRadius:'4px', width:'20px', height:'20px', cursor:'pointer'}} onClick={() => handleRemoveItem(cat.id, item)}>-</button>
                              <span style={{fontSize:'0.9rem', fontWeight:'600'}}>{count}</span>
                              <button style={{background:'var(--forest-green)', color:'white', border:'none', borderRadius:'4px', width:'20px', height:'20px', cursor:'pointer'}} onClick={() => handleAddItem(cat.id, item)}>+</button>
                            </div>
                          </div>
                          <span>₹{item.price * count}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                );
              })}
              <div ref={previewEndRef} />
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar} style={{flexDirection: 'column', gap: '12px'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--forest-green)', background: 'var(--sage-light)', padding: '6px 16px', borderRadius: '20px'}}>
          <span>Protein: {totalNutrition.protein}g</span>
          <span>Carbs: {totalNutrition.carbs}g</span>
          <span>Fat: {totalNutrition.fat}g</span>
          <span>Cals: {totalNutrition.calories}</span>
        </div>
        <div style={{display: 'flex', width: '100%', gap: '16px', alignItems: 'stretch'}}>
          <div className={styles.qtyControls}>
            <button className={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button className={styles.addBtn} onClick={handleAddToCartClick}>
            Add to cart - ₹{totalPrice * quantity}
          </button>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{textAlign: 'center', padding: 'var(--space-2xl)'}}
            >
              <h2 style={{fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)'}}>Would you like to save this bowl?</h2>
              <p style={{color: 'var(--espresso-soft)', marginBottom: 'var(--space-xl)'}}>Save "{bowlName}" to easily order it again next time.</p>
              
              <div style={{display: 'flex', gap: 'var(--space-md)'}}>
                <button 
                  className={styles.cancelBtn} 
                  onClick={handleJustAddToCart}
                  style={{flex: 1, background: 'var(--cream-light)', padding: '12px', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', color: 'var(--espresso)'}}
                >
                  Just Add to Cart
                </button>
                <button 
                  className={styles.saveBtn} 
                  onClick={handleSaveAndAddToCart}
                  style={{flex: 1, background: 'var(--forest-green)', padding: '12px', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', color: 'var(--white)'}}
                >
                  Save & Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
