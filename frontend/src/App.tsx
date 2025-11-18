import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import CategoryPage from './components/CategoryPage';
import Categories from './components/Categories';
import CartPage from './components/CartPage';
import Login from './components/Login';
import Register from './components/Register';
import OrderDetails from './components/OrderDetails';
import OrderSummary from './components/OrderSummary';
import ProductDetails from './components/ProductDetails';
import EmailTest from './components/EmailTest';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import FirstOrderDiscountPopup from './components/FirstOrderDiscountPopup';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { TempSamplesProvider } from './contexts/TempSamplesContext';
import { useFirstOrderPopup } from './hooks/useFirstOrderPopup';
import DiscountDebugPage from './components/DiscountDebugPage';
import CancellationRefundPolicy from './components/CancellationRefundPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import ShippingPolicy from './components/ShippingPolicy';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactPolicyPage from './components/ContactPolicyPage';

// Inner component to use hooks after providers are initialized
function AppContent() {
  const { isVisible, hidePopup, onClaim } = useFirstOrderPopup();

  return (
    <>
      <Navbar />
      <div className="pt-14 sm:pt-16">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/email-test" element={<EmailTest />} />
          <Route path="/debug/discount" element={<DiscountDebugPage />} />

          {/* Policy pages for legal & compliance */}
          <Route path="/cancellation-refund" element={<CancellationRefundPolicy />} />
          <Route path="/cancellation-refund.html" element={<CancellationRefundPolicy />} />

          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/terms-and-conditions.html" element={<TermsAndConditions />} />

          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/shipping-policy.html" element={<ShippingPolicy />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy.html" element={<PrivacyPolicy />} />

          <Route path="/contact-us" element={<ContactPolicyPage />} />
          <Route path="/contact-us.html" element={<ContactPolicyPage />} />

          {/* EmailJS routes removed */}
        </Routes>
      </div>
      
      {/* First Order Discount Popup */}
      <FirstOrderDiscountPopup 
        isVisible={isVisible}
        onClose={hidePopup}
        onClaim={onClaim}
      />
    </>
  );
}

function App() {
  useEffect(() => {
    // Clean up demo data on production to ensure fresh start for visitors
    if (window.location.hostname === 'www.shreeraagaswaadghar.com' || window.location.hostname === 'shreeraagaswaadghar.com') {
      // Clear demo/test user data that might show personal info
      const keysToRemove = [
        'demo_user',
        'currentUser',
        'testUser',
        'tempUser',
        'hasDiscountEligibility', // Clear the discount eligibility flag that's causing issues
        'freeSamplesClaimed'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Also clear any profile data that might contain personal info
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('profile_demo') || key.startsWith('profile_test')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('🧹 Production cleanup completed - cleared demo data and discount flags');
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <TempSamplesProvider>
          <AppContent />
        </TempSamplesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;