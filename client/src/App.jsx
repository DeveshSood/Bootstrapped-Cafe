import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider, useCart } from './components/Cart/CartContext';
import Navbar from './components/Navbar/Navbar';
import CartDrawer from './components/Cart/CartDrawer';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import GrainOverlay from './components/common/GrainOverlay';
import ScrollProgress from './components/common/ScrollProgress';
import PageTransition from './components/common/PageTransition';
import ActiveOrderWidget from './components/ActiveOrderWidget/ActiveOrderWidget';

import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import CoworkingPage from './pages/CoworkingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import TrackOrderPage from './pages/TrackOrderPage';
import RestaurantDashboard from './pages/RestaurantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReceiptPage from './pages/ReceiptPage';

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

  React.useEffect(() => {
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const isReceiptPage = location.pathname.startsWith('/receipt');

  return (
    <>

      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      {checkoutLoader && (
        <LoadingScreen 
          onMidpoint={() => navigate('/checkout')}
          onComplete={() => setCheckoutLoader(false)}
        />
      )}
      {!isReceiptPage && <GrainOverlay />}
      {location.pathname !== '/login' && !isReceiptPage && (
        <>
          <ScrollProgress />
          <ActiveOrderWidget />
        </>
      )}
      
      {/* Navbar visible on all pages except receipt */}
      {!isReceiptPage && (
        <Navbar
          cartCount={totalItems}
          cartTotal={totalPrice}
          onCartClick={() => setCartOpen(!cartOpen)}
          isCartOpen={cartOpen}
        />
      )}
      
      {!isReceiptPage && (
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={handleCheckout}
        />
      )}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/menu" element={<PageTransition><MenuPage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          
          {/* Optionally protected routes (Checkout handles its own auth checks, or is open) */}
          <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
          <Route path="/coworking" element={<PageTransition><CoworkingPage /></PageTransition>} />
          
          {/* Protected Routes — Users */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <PageTransition><ProfilePage /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/track/:orderId" element={
            <ProtectedRoute>
              <PageTransition><TrackOrderPage /></PageTransition>
            </ProtectedRoute>
          } />

          {/* Protected Routes — Staff/Admin */}
          <Route path="/restaurant" element={
            <ProtectedRoute requireStaff>
              <PageTransition><RestaurantDashboard /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <PageTransition><AdminDashboard /></PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/receipt/:id" element={<ReceiptPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
