import React, { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './PamphletMenu.module.css';

import page1 from '../../assets/images/menu-pages/page-1.jpg';
import page2 from '../../assets/images/menu-pages/page-2.jpg';
import page3 from '../../assets/images/menu-pages/page-3.jpg';
import page4 from '../../assets/images/menu-pages/page-4.jpg';
import page5 from '../../assets/images/menu-pages/page-5.jpg';

const menuPages = [page1, page2, page3, page4, page5];

const Page = React.forwardRef((props, ref) => {
  return (
    <div className={styles.page} ref={ref} data-density="hard">
      <div className={styles.pageContent}>
        <img src={props.image} alt={`Menu Page ${props.number}`} className={styles.pageImage} />
      </div>
    </div>
  );
});

const PamphletMenu = () => {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const onPage = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <div className={styles.pamphletContainer}>
      <div className={styles.bookWrapper}>
        <div className={styles.bookBackground}>
          <HTMLFlipBook
            width={400}
            height={565}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            showCover={false}
            showPageCorners={false}
            mobileScrollSupport={true}
            onFlip={onPage}
            className={styles.flipBook}
            ref={bookRef}
          >
            {menuPages.map((page, index) => (
              <Page key={index} number={index + 1} image={page} />
            ))}
            {/* Add a branded back cover so the book closes nicely */}
            <div className={styles.page} data-density="hard">
              <div className={`${styles.pageContent} ${styles.backCover}`}>
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--warm-cream)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Proteyns</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', opacity: 0.8 }}>Healthy Always Tastes Good</p>
                </div>
              </div>
            </div>
          </HTMLFlipBook>
        </div>
      </div>

      <div className={styles.bookControls}>
        <button 
          className={styles.controlBtn} 
          onClick={() => bookRef.current.pageFlip().flipPrev()}
          disabled={currentPage === 0}
        >
          ← Prev Page
        </button>
        <span className={styles.pageIndicator}>
          Page {currentPage + 1} of {menuPages.length + 1}
        </span>
        <button 
          className={styles.controlBtn} 
          onClick={() => bookRef.current.pageFlip().flipNext()}
          disabled={currentPage >= menuPages.length}
        >
          Next Page →
        </button>
      </div>
      
      <p className={styles.instructionText}>
        Drag corners or click edges to turn pages
      </p>
    </div>
  );
};

export default PamphletMenu;
