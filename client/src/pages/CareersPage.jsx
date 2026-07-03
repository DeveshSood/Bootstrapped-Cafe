import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';
import Footer from '../components/Footer/Footer';
import { useToast } from '../context/ToastContext';
import styles from './CareersPage.module.css';

const JOB_OPENINGS = [
  { id: 1, title: 'Head Chef', type: 'Full-time', location: 'On-site', department: 'Kitchen' },
  { id: 2, title: 'Barista (Specialty Coffee)', type: 'Part-time', location: 'On-site', department: 'Cafe' },
  { id: 3, title: 'Community Manager', type: 'Full-time', location: 'Hybrid', department: 'Operations' },
  { id: 4, title: 'Delivery Partner', type: 'Contract', location: 'Field', department: 'Logistics' },
];

const CareersPage = () => {
  const toast = useToast();

  const handleApply = (title) => {
    toast.success(`Application portal for ${title} will open soon!`);
  };

  return (
    <>
      <main className={styles.careersPage}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading 
              label="Careers"
              heading="Join the revolution."
              italicWord="revolution"
              align="center"
            />
            <p className={styles.heroSubtitle}>
              We are a collective of food lovers, tech enthusiasts, and community builders. 
              If you believe that healthy food and great workspaces can change lives, you belong here.
            </p>
          </motion.div>

          <div className={styles.perksGrid}>
            {[
              { icon: '🥑', title: 'Free Daily Meals', desc: 'Enjoy our entire menu for free on the days you work.' },
              { icon: '🏥', title: 'Health & Wellness', desc: 'Comprehensive health insurance for you and your dependents.' },
              { icon: '📚', title: 'Learning Stipend', desc: 'Annual allowance for courses, books, and self-improvement.' },
            ].map((perk, index) => (
              <motion.div 
                key={index} 
                className={styles.perkCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                <div className={styles.perkIcon}>{perk.icon}</div>
                <h4 className={styles.perkTitle}>{perk.title}</h4>
                <p className={styles.perkDesc}>{perk.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.section 
            className={styles.jobsSection}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className={styles.jobsHeader}>
              <h2 className={styles.jobsTitle}>Open Positions</h2>
            </div>
            
            <div className={styles.jobList}>
              {JOB_OPENINGS.map((job) => (
                <motion.div 
                  key={job.id} 
                  className={styles.jobCard}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className={styles.jobInfo}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <div className={styles.jobMeta}>
                      <span className={styles.jobMetaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        {job.department}
                      </span>
                      <span className={styles.jobMetaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {job.type}
                      </span>
                      <span className={styles.jobMetaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <Button variant="outlined" size="md" onClick={() => handleApply(job.title)}>Apply Now</Button>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CareersPage;
