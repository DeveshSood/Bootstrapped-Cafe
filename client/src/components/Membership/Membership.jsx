import React, { useState } from 'react';
import ScrollReveal from '../common/ScrollReveal';
import Button from '../common/Button';
import BookingPopup from '../Coworking/BookingPopup';
import styles from './Membership.module.css';

const plans = [
  {
    title: 'Balanced Nutrition Plan',
    price: '₹5,500',
    basePrice: 5500,
    suffix: '/ mo',
    period: '/ month (20 days)',
    features: ['Lunch and Dinner (5 days/week)', 'Grilled 100gm Chicken/Paneer/Egg', 'Carbs Rice/Quinoa/Flavoured Rice', '5 Non Repetitive Salads 100gm', 'Sauteed Exotic Veg 100gm'],
    desc: 'Veg Dal of the day 80gm included. Perfect for maintaining a healthy lifestyle.',
    popular: true,
  },
  {
    title: 'Weight Loss Plan',
    price: '₹6,500',
    basePrice: 6500,
    suffix: '/ mo',
    period: '/ month (20 days)',
    features: ['Lunch or Dinner (5 days/week)', 'Grilled 180gm Chicken/Paneer/Egg', '2 Sauteed Exotic Veg 150gm', '5 Non Repetitive Salads 200gm', 'Veg/Nonveg curry of the day'],
    desc: 'Silky Tofu 30gm included. Designed to help you lose weight efficiently.',
    popular: false,
  },
  {
    title: 'Muscle Gain Plan',
    price: '₹7,000',
    basePrice: 7000,
    suffix: '/ mo',
    period: '/ month (20 days)',
    features: ['Lunch or Dinner (5 days/week)', 'Grilled 180gm Chicken/Paneer/Egg', 'Carbs Rice/Quinoa', 'Tofu 40gm & Veg Stir-Fry 150gm', '5 Non Repetitive Salads 200gm'],
    desc: 'Veg/Nonveg curry of the day included. High protein meals to build muscle.',
    popular: false,
  },
];

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <>
      <section className={styles.membershipSection} id="membership">
        
        <ScrollReveal animation="fadeUp" duration={800} threshold={0.15}>
          <div className={styles.container}>
            <div className={styles.header}>
              <span className={styles.label}>Plans & Subscriptions</span>
              <h3 className={styles.heading}>Invest in your health.</h3>
              <p className={styles.desc}>Flexible meal plans and workspace subscriptions designed for every lifestyle.</p>
            </div>
            
            <div className={styles.planGrid}>
              {plans.map((plan) => (
                <div 
                  key={plan.title} 
                  className={`${styles.planCard} ${plan.popular ? styles.popularCard : ''}`}
                >
                  {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
                  
                  <h4 className={styles.planTitle}>{plan.title}</h4>
                  <div className={styles.planPrice}>
                    <span className={styles.planAmount}>{plan.price}</span>
                    <span className={styles.planPeriod}>{plan.period}</span>
                  </div>
                  
                  <ul className={styles.planFeatures}>
                    {plan.features.map(f => (
                      <li key={f} className={styles.planFeature}>
                        <span className={styles.checkIcon}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  
                  <div className={styles.btnWrapper}>
                    <Button 
                      variant={plan.popular ? 'filled' : 'outlined'} 
                      size="md" 
                      onClick={() => setSelectedPlan(plan)}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <BookingPopup 
        isOpen={!!selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
        defaultPlan={selectedPlan} 
      />
    </>
  );
};

export default Membership;
