import React from 'react';
import styles from './ScrollRevealMenu.module.css';

import { useCart } from '../Cart/CartContext';
import SlotCounter from '../common/SlotCounter';

/**
 * MealCard — Redesigned nested card based on user reference
 */
const MealCard = ({ meal, style }) => {
  const { name, price, image, tags, isVeg } = meal;
  const { items, addItem, updateQuantity } = useCart();

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
    <div className={styles.mealCardWrapper} style={style}>
      <div className={styles.flipCardInner}>
        
        {/* FRONT SIDE */}
        <div className={styles.flipCardFront}>
          <div className={styles.mealCardTop}>
            <div className={styles.mealImageContainer}>
              <img src={image} alt={name} loading="lazy" className={styles.mealImage} />
              {isVeg && <div className={styles.vegBadge}>Veg</div>}
            </div>
            <div className={styles.mealPromoBar}>
              {isVeg ? '100% Vegetarian' : 'High Quality Protein'}
            </div>
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
              <div className={styles.flipPrompt}>Details ↗</div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className={styles.flipCardBack}>
          <h4 className={styles.mealTitleBack}>{name}</h4>
          <div className={styles.mealPriceBack}>₹{price}</div>
          <p className={styles.mealDescription}>{meal.description}</p>
          
          <div className={styles.mealFooterRow}>
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
