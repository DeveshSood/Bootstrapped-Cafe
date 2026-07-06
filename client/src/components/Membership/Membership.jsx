import React, { useState } from 'react';
import ScrollReveal from '../common/ScrollReveal';
import Button from '../common/Button';
import BookingPopup from '../Coworking/BookingPopup';
import styles from './Membership.module.css';

const plans = [
  {
    title: 'Regular Bowl Subscription',
    price: '₹5,040',
    basePrice: 5040,
    suffix: '/ mo',
    period: '/ month',
    features: ['20 Regular Bowls', '3 days carried forward', 'Choose 1 Carb & 2 Proteins', 'Daily new exotic veggies', 'Curry of the day included'],
    desc: 'Duration 20 days with 3 days carried forward. Enjoy our healthy Regular Bowl daily.',
    popular: false,
  },
  {
    title: 'Super Bowl Promo',
    price: '₹6,000',
    basePrice: 6000,
    suffix: '/ mo',
    period: '/ month',
    features: ['20 Super Bowls (~15% OFF)', 'All salads bar selections', 'Protein combination allowed', 'Zero processing & additives', '3 days carried forward'],
    desc: 'Get the ₹350 Super Bowl for ₹300! Special Monthly 20 Bowls Subscription Promo.',
    popular: true,
  },
  {
    title: 'Workspace Rental',
    price: '₹100',
    basePrice: 100,
    suffix: '/ hr',
    period: '/ hour',
    features: ['Focus Pod (₹100/hr)', 'Meeting Pod (₹300/hr)', 'Complimentary beverage', 'High-speed connectivity', 'Ergonomic climate-control'],
    desc: 'Private pods designed for deep work, privacy, and collaborative sessions.',
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
