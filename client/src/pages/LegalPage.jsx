import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer/Footer';
import styles from './LegalPage.module.css';

const privacyContent = [
  { id: 'collection', title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.' },
  { id: 'usage', title: '2. Use of Information', content: 'We may use the information we collect about you to provide, maintain, and improve our services, including, for example, to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support to Users, develop safety features, authenticate users, and send product updates and administrative messages.' },
  { id: 'sharing', title: '3. Sharing of Information', content: 'We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: With third party service providers who need access to such information to carry out work on our behalf; In response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.' },
  { id: 'security', title: '4. Security', content: 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.' },
  { id: 'contact', title: '5. Contact Us', content: 'If you have any questions about this Privacy Statement, please contact us at privacy@bootstrappedcafe.com.' },
];

const termsContent = [
  { id: 'acceptance', title: '1. Acceptance of Terms', content: 'By accessing and using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.' },
  { id: 'services', title: '2. Description of Services', content: 'Bootstrapped Cafe provides a platform for ordering healthy meals, booking coworking spaces, and subscribing to meal plans. We reserve the right to modify or discontinue, temporarily or permanently, the services with or without notice.' },
  { id: 'account', title: '3. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.' },
  { id: 'payments', title: '4. Payments & Refunds', content: 'All payments are securely processed via Razorpay. Subscriptions are billed on a recurring basis as specified at checkout. Refund requests for daily orders must be made within 15 minutes of placing the order.' },
  { id: 'liability', title: '5. Limitation of Liability', content: 'Bootstrapped Cafe shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.' },
];

const LegalPage = ({ type = 'privacy' }) => {
  const [activeSection, setActiveSection] = useState('');
  
  const content = type === 'privacy' ? privacyContent : termsContent;
  const title = type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions';
  const lastUpdated = 'June 29, 2026';

  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      for (const section of content) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top < 150) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [content]);

  return (
    <>
      <main className={styles.legalPage}>
        <div className={styles.container}>
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.lastUpdated}>Last Updated: {lastUpdated}</p>
          </motion.div>

          <div className={styles.contentWrapper}>
            <div className={styles.sidebar}>
              <div className={styles.toc}>
                <span className={styles.tocTitle}>Table of Contents</span>
                {content.map(section => (
                  <a 
                    key={section.id} 
                    href={`#${section.id}`} 
                    className={`${styles.tocLink} ${activeSection === section.id ? styles.tocLinkActive : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(section.id);
                      if (el) {
                        window.scrollTo({
                          top: el.getBoundingClientRect().top + window.scrollY - 100,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </div>

            <motion.div 
              className={styles.mainContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {content.map((section) => (
                <div key={section.id} id={section.id} className={styles.section}>
                  <h2>{section.title}</h2>
                  <p>{section.content}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LegalPage;
