import React from 'react';
import styles from './ScrollRevealMenu.module.css';

import { useCart } from '../Cart/CartContext';
import SlotCounter from '../common/SlotCounter';

/**
 * MealCard — Redesigned nested card based on user reference
 */
const MealCard = ({ meal, style, id, onDetailsClick, isDrink }) => {
  const { name, price, image, tags, isVeg } = meal;
  const { items, addItem, updateQuantity } = useCart();

  const categorizeIngredients = (ingredients) => {
    if (!ingredients || !Array.isArray(ingredients)) return {};
    const categories = {
      'Protein': [],
      'Curry of the day': [],
      'Salads': [],
      'Phytos': [],
      'Carbs': [],
      'Base': []
    };
    ingredients.forEach(ing => {
      const lower = ing.toLowerCase();
      if (/\b(chicken|paneer|eggs?|tofu|fish)\b/i.test(lower)) {
        categories['Protein'].push(ing.split(' -')[0]);
      } else if (/\b(rice|quinoa|millets|oats)\b/i.test(lower)) {
        categories['Carbs'].push(ing.split(' -')[0]);
      } else if (/\b(dal|rajma|chole|stew)\b/i.test(lower)) {
        categories['Curry of the day'].push(ing.split(' -')[0]);
      } else if (/\b(salsa|salad|hummus|chana|chickpea|potato|cucumber|lettuce|tomato|onion|cabbage|beetroot|peas|watermelon|muskmelon|apple)\b/i.test(lower)) {
        categories['Salads'].push(ing.split(' -')[0]);
      } else if (/\b(broccoli|capsicum|zucchini|carrot|cauliflower|mushroom|bhindi|gobi|bell pepper|beans|veggies)\b/i.test(lower)) {
        categories['Phytos'].push(ing.split(' -')[0]);
      } else {
        categories['Base'].push(ing.split(' -')[0]);
      }
    });
    const result = {};
    for (const [key, value] of Object.entries(categories)) {
      if (value.length > 0) result[key] = value;
    }
    return result;
  };

  const isHomeBrewed = meal.category === 'Home brewed drinks';

  const cartItem = items.find(i => i.id === meal.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleIncrease = (e) => {
    e.stopPropagation();
    if (quantity === 0) {
      addItem(meal);
    } else {
      updateQuantity(meal.id, quantity + 1);
    }
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (quantity > 0) {
      updateQuantity(meal.id, quantity - 1);
    }
  };

  return (
    <div className={styles.mealCardWrapper} style={{ ...style, minHeight: isDrink ? '330px' : '290px' }} id={id}>
      <div className={styles.flipCardInner}>
        

        <div className={styles.flipCardFront}>
          <div className={styles.mealCardTop}>
            <div className={styles.mealImageContainer} style={isDrink ? { height: '200px' } : {}}>
              <img 
                src={image} 
                alt={name} 
                loading="lazy" 
                className={styles.mealImage} 
                style={isHomeBrewed ? { objectFit: 'contain', padding: '16px', mixBlendMode: 'multiply' } : {}}
              />
              {isVeg && <div className={styles.vegBadge}>Veg</div>}
            </div>
            {meal.nutrition ? (
              <div className={styles.mealPromoBar} style={{display: 'flex', justifyContent: 'space-evenly', gap: '4px', padding: '6px 4px', lineHeight: '1.2'}}>
                <div style={{display: 'flex', flexDirection: 'column', color: 'var(--forest-green)', alignItems: 'center', flex: 1}}>
                  <span style={{fontSize: '0.6rem', fontWeight: 800, marginBottom: '2px'}}>PROTEIN</span>
                  <span style={{fontSize: '0.75rem', fontWeight: 700}}>{typeof meal.nutrition.protein === 'string' ? meal.nutrition.protein.toUpperCase() : `${meal.nutrition.protein}G`}</span>
                </div>
                <div style={{width: '1px', background: 'rgba(0,0,0,0.15)', margin: '2px 0'}}></div>
                <div style={{display: 'flex', flexDirection: 'column', color: 'var(--espresso)', alignItems: 'center', flex: 1}}>
                  <span style={{fontSize: '0.6rem', fontWeight: 800, marginBottom: '2px'}}>CARBS</span>
                  <span style={{fontSize: '0.75rem', fontWeight: 700}}>{typeof meal.nutrition.carbs === 'string' ? meal.nutrition.carbs.toUpperCase() : `${meal.nutrition.carbs}G`}</span>
                </div>
                <div style={{width: '1px', background: 'rgba(0,0,0,0.15)', margin: '2px 0'}}></div>
                <div style={{display: 'flex', flexDirection: 'column', color: 'var(--terracotta)', alignItems: 'center', flex: 1}}>
                  <span style={{fontSize: '0.6rem', fontWeight: 800, marginBottom: '2px'}}>FAT</span>
                  <span style={{fontSize: '0.75rem', fontWeight: 700}}>{typeof meal.nutrition.fat === 'string' ? meal.nutrition.fat.toUpperCase() : `${meal.nutrition.fat}G`}</span>
                </div>
              </div>
            ) : (
              <div className={styles.mealPromoBar}>
                {isVeg ? '100% Vegetarian' : 'High Quality Protein'}
              </div>
            )}
          </div>
          <div className={styles.mealFrontDetails}>
            <div className={styles.mealFrontDetailsLeft}>
              <h4 className={styles.mealTitle}>{name}</h4>
              <div className={styles.mealTagsBox}>
                {tags && tags.map(tag => (
                  <span key={tag} className={styles.mealPillTag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className={styles.mealFrontDetailsDivider}></div>
            <div className={styles.mealFrontDetailsRight}>
              <div className={styles.mealPriceBox}>₹{price}</div>
              <div className={styles.flipPrompt} onClick={(e) => { e.stopPropagation(); if(onDetailsClick) onDetailsClick(meal); }}>Details ↗</div>
            </div>
          </div>
        </div>


        <div className={styles.flipCardBack}>
          <h4 className={styles.mealTitleBack}>{name}</h4>
          <div className={styles.mealPriceBack}>₹{price}</div>
          {meal.ingredients ? (
            <div className={styles.mealDescription} style={{ width: '100%', overflowY: 'hidden', padding: '4px 0', flex: 1 }}>
              {isDrink ? (
                <div style={{ 
                  fontSize: '0.9em', 
                  opacity: 0.9, 
                  lineHeight: '1.3', 
                  margin: '0 auto', 
                  textAlign: 'center', 
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {meal.ingredients.map((ing, idx) => (
                    <div key={idx} style={{ marginBottom: '4px' }}>{ing.split(' -')[0]}</div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.65rem', textAlign: 'left', display: 'flex', flexWrap: 'wrap', gap: '4px', alignContent: 'flex-start', width: '100%' }}>
                  {Object.entries(categorizeIngredients(meal.ingredients)).map(([catName, items]) => (
                    <div key={catName} style={{background: 'rgba(255,255,255,0.6)', padding: '2px 4px', borderRadius: '4px', width: '48%', boxSizing: 'border-box'}}>
                      <span style={{fontWeight: '800', color: 'var(--forest-green)', display: 'block', fontSize: '0.55rem', textTransform: 'uppercase', marginBottom: '1px'}}>{catName}</span>
                      <span style={{color: 'var(--espresso-soft)', fontWeight: '600', lineHeight: 1.1, display: 'block', fontSize: '0.6rem'}}>{items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className={styles.mealDescription}>{meal.description}</p>
          )}
          <div className={styles.mealFooterRow} style={{ display: 'flex', justifyContent: 'center', gap: '12px', width: '100%', alignItems: 'center' }}>
            <button
              onClick={(e) => { e.stopPropagation(); if(onDetailsClick) onDetailsClick(meal); }}
              style={{ background: 'var(--white)', border: '1px solid var(--border-light)', padding: '6px 16px', borderRadius: '20px', color: 'var(--espresso)', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => {e.currentTarget.style.background='var(--sage-light)'; e.currentTarget.style.borderColor='var(--forest-green)'; e.currentTarget.style.color='var(--forest-green)';}}
              onMouseOut={e => {e.currentTarget.style.background='var(--white)'; e.currentTarget.style.borderColor='var(--border-light)'; e.currentTarget.style.color='var(--espresso)';}}
            >
              Details
            </button>
            {quantity === 0 ? (
              <button
                className={styles.mealOrderBtn}
                onClick={handleIncrease}
                aria-label={`Add ${name} to cart`}
              >
                <span className={styles.mealOrderBtnIcon}>🛒</span>
                <span className={styles.mealOrderBtnText}>Add to Cart</span>
              </button>
            ) : (
              <div className={styles.mealQuantityControl}>
                <button className={styles.mqBtn} onClick={handleDecrease}>−</button>
                <SlotCounter value={quantity} className={styles.mqCount} prefix="" />
                <button className={styles.mqBtn} onClick={handleIncrease}>+</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MealCard;
