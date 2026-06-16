import React, { useState } from 'react';
import ScrollReveal from '../common/ScrollReveal';
import Button from '../common/Button';
import BookingPopup from '../Coworking/BookingPopup';
import styles from './Membership.module.css';

const plans = [
  {
    title: 'Monthly Meal Plan',
    price: '₹7,999',
    period: '/month',
    features: ['20 healthy meals', 'Free delivery', 'Custom macro targets', 'Weekly menu rotation', 'Pause anytime'],
    popular: false,
  },
  {
    title: 'Student Coworking',
    price: '₹4,999',
    period: '/month',
    features: ['Unlimited day passes', 'Healthy snack included', 'Silent booth access', 'Fast WiFi', 'Community events'],
    popular: true,
  },
  {
    title: 'Corporate Lunch',
    price: '₹249',
    period: '/person/day',
    features: ['Custom team menus', 'Meeting room meals', 'Dietary accommodations', 'Invoice billing', 'Dedicated coordinator'],
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
