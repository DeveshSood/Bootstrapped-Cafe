import React from 'react';
import ScrollReveal from '../common/ScrollReveal';
import Button from '../common/Button';
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
  return (
    <section className={styles.membership} id="membership">
      <ScrollReveal animation="fadeUp" duration={800} threshold={0.15}>
        <div className={styles.membershipHeader}>
          <span className={styles.membershipLabel}>Plans & Subscriptions</span>
          <h3 className={styles.membershipHeading}>Invest in your health.</h3>
          <p className={styles.membershipDesc}>Flexible meal plans and workspace subscriptions designed for every lifestyle.</p>
        </div>
        <div className={styles.planGrid}>
          {plans.map((plan) => (
            <div key={plan.title} className={`${styles.planCard} ${plan.popular ? styles['planCard--popular'] : ''}`}>
              {plan.popular && <span className={styles.popularBadge}>Most Popular</span>}
              <h4 className={styles.planTitle}>{plan.title}</h4>
              <div className={styles.planPrice}>
                <span className={styles.planAmount}>{plan.price}</span>
                <span className={styles.planPeriod}>{plan.period}</span>
              </div>
              <ul className={styles.planFeatures}>
                {plan.features.map(f => <li key={f} className={styles.planFeature}>✓ {f}</li>)}
              </ul>
              <Button variant={plan.popular ? 'filled' : 'outlined'} size="md" style={{ width: '100%', justifyContent: 'center' }}>
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Membership;
