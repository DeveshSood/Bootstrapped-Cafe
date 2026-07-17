import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';
import Footer from '../components/Footer/Footer';
import { useToast } from '../context/ToastContext';
import styles from './ContactPage.module.css';

import mapPlaceholder from '../assets/images/CAFE 1.png';

const ContactPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Your message has been sent. We will get back to you shortly!');
    }, 1200);
  };

  return (
    <>
      <main className={styles.contactPage}>
        <div className={styles.container}>
          <motion.div 
            className={styles.headingWrapper}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SectionHeading 
              label="Contact Us"
              heading="Let's start a conversation."
              italicWord="conversation"
              align="center"
            />
          </motion.div>

          <div className={styles.contentGrid}>
            <motion.div 
              className={styles.infoCol}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className={styles.infoBlock}>
                <h3>Visit Us</h3>
                <p>144, 3rd Floor, Shubharam Complex<br />Above HDFC Bank, Near Trinity Metro Station<br />MG Road, Bengaluru</p>
                <div className={styles.mapWrapper}>
                  <img src={mapPlaceholder} alt="Cafe location map" className={styles.mapPlaceholder} />
                </div>
              </div>

              <div className={styles.infoBlock}>
                <h3>Opening Hours</h3>
                <p><strong>Monday - Friday:</strong> 7:00 AM - 9:00 PM<br />
                <strong>Saturday - Sunday:</strong> 8:00 AM - 10:00 PM</p>
              </div>

              <div className={styles.infoBlock}>
                <h3>Get in Touch</h3>
                <p><strong>Email:</strong> hello@bootstrappedcafe.com<br />
                <strong>Phone:</strong> +91 6364 365637 / +91 8284 879989<br />
                <strong>Instagram:</strong> @PROTEYNS.CAFE</p>
              </div>
            </motion.div>

            <motion.div 
              className={styles.formCol}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h3 className={styles.formTitle}>Send a Message</h3>
              <p className={styles.formDesc}>Have a question about our menu, catering, or coworking space? Drop us a line below.</p>
              
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className={styles.input} 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className={styles.input} 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    className={styles.textarea} 
                    required 
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <Button variant="filled" size="lg" type="submit" style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
