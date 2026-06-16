import React from 'react';
import { motion } from 'framer-motion';
import styles from './PamphletMenu.module.css';

const PamphletMenu = ({ items, onItemClick }) => {
  // Group items by category
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className={styles.pamphletContainer}>
      <motion.div 
        className={styles.pamphletWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.pamphletInner}>
          <div className={styles.brandHeader}>
            <h2 className={styles.brandTitle}>Proteyns</h2>
            <p className={styles.brandSubtitle}>Healthy Always Tastes Good</p>
          </div>

          {Object.entries(categories).map(([category, catItems]) => (
            <div key={category} className={styles.categoryBlock}>
              <div className={styles.categoryRibbon}>
                <h3>{category}</h3>
              </div>
              <div className={styles.itemList}>
                {catItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className={styles.menuItem}
                    variants={itemVariants}
                    onClick={() => onItemClick && onItemClick(item)}
                  >
                    <div className={styles.itemContent}>
                      <div className={styles.itemHeader}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <span className={styles.itemPrice}>₹{item.price}</span>
                      </div>
                      <p className={styles.itemDescription}>{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.brandFooter}>
            <div className={styles.ornament}>❦</div>
          </div>
        </div>
      </motion.div>
      <p className={styles.instructionText}>
        Tap any meal to view and add it to your cart.
      </p>
    </div>
  );
};

export default PamphletMenu;
