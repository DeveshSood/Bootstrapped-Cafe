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
    <div className={styles.mealCardWrapper} style={{ ...style, minHeight: isDrink ? '330px' : '240px' }} id={id}>
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
                  <span style={{fontSize: '0.75rem', fontWeight: 700}}>{meal.nutrition.protein.toUpperCase()}</span>
                </div>
                <div style={{width: '1px', background: 'rgba(0,0,0,0.15)', margin: '2px 0'}}></div>
                <div style={{display: 'flex', flexDirection: 'column', color: 'var(--espresso)', alignItems: 'center', flex: 1}}>
                  <span style={{fontSize: '0.6rem', fontWeight: 800, marginBottom: '2px'}}>CARBS</span>
                  <span style={{fontSize: '0.75rem', fontWeight: 700}}>{meal.nutrition.carbs.toUpperCase()}</span>
                </div>
                <div style={{width: '1px', background: 'rgba(0,0,0,0.15)', margin: '2px 0'}}></div>
                <div style={{display: 'flex', flexDirection: 'column', color: 'var(--terracotta)', alignItems: 'center', flex: 1}}>
                  <span style={{fontSize: '0.6rem', fontWeight: 800, marginBottom: '2px'}}>FAT</span>
                  <span style={{fontSize: '0.75rem', fontWeight: 700}}>{meal.nutrition.fat.toUpperCase()}</span>
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
            <div className={styles.mealDescription} style={{ width: '100%' }}>
              {isDrink ? (
                <div style={{ 
                  fontSize: '1.1em', 
                  opacity: 0.9, 
                  lineHeight: '1.5', 
                  margin: '0 auto', 
                  textAlign: 'center', 
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {meal.ingredients.map((ing, idx) => (
                    <div key={idx} style={{ marginBottom: '8px' }}>{ing.split(' -')[0]}</div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.95em', fontWeight: '500', opacity: 0.9, lineHeight: '1.5', margin: 0, textAlign: 'center' }}>
                  {meal.ingredients.map(ing => ing.split(' -')[0]).join(', ')}
                </p>
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
