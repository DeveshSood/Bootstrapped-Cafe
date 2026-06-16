import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider, useCart } from './components/Cart/CartContext';
import Navbar from './components/Navbar/Navbar';
import CartDrawer from './components/Cart/CartDrawer';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import GrainOverlay from './components/common/GrainOverlay';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import ScrollProgress from './components/common/ScrollProgress';
import PageTransition from './components/common/PageTransition';
import CustomCursor from './components/common/CustomCursor';

const AppContent = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [checkoutLoader, setCheckoutLoader] = useState(false);
  const { totalItems, totalPrice } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutLoader(true);
  };

  return (
    <>
      <CustomCursor />
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {checkoutLoader && (
        <LoadingScreen 
          onMidpoint={() => navigate('/checkout')}
          onComplete={() => setCheckoutLoader(false)}
        />
      )}
      <GrainOverlay />
      <ScrollProgress />
      <Navbar
        cartCount={totalItems}
        cartTotal={totalPrice}
        onCartClick={() => setCartOpen(true)}
      />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/menu" element={<PageTransition><MenuPage /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
};

export default App;
