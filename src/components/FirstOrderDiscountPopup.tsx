import React, { useState, useEffect } from 'react';
import { X, Percent, Sparkles, Star, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface FirstOrderDiscountPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onClaim: () => void;
}

const FirstOrderDiscountPopup: React.FC<FirstOrderDiscountPopupProps> = ({ isVisible, onClose, onClaim }) => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);

  // Handle login redirect for non-logged-in users
  const handleLoginToClaimClick = () => {
    navigate('/login', { 
      state: { 
        returnTo: '/',
        message: 'Please login first to claim your 50% off first order discount' 
      }
    });
    onClose();
  };

  // Handle claim button click for logged-in users
  const handleClaimClick = async () => {
    if (!user) {
      // This shouldn't happen as we show different buttons
      handleLoginToClaimClick();
      return;
    }

    // User is logged in - check if they've already used the offer
    if (profile?.hasUsedOffer) {
      // Show message and close popup
      onClose();
      return;
    }

    setClaiming(true);
    
    try {
      // Mark the offer as claimed (but not used yet)
      await updateProfile({ offerClaimed: true });
      
      // Store in localStorage for immediate use
      localStorage.setItem('firstOrderDiscountClaimed', 'true');
      localStorage.setItem(`firstOrderDiscount_${user.id}`, 'true');
      
      // Navigate to main page with categories section to start shopping
      onClose();
      // Navigate to home page and scroll to categories section
      navigate('/');
      setTimeout(() => {
        const categoriesSection = document.getElementById('categories');
        if (categoriesSection) {
          categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      onClaim();
    } catch (error) {
      console.error('Error claiming discount:', error);
    } finally {
      setClaiming(false);
    }
  };

  // Handle close
  const handleClose = () => {
    onClose();
  };

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        {/* Popup Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
        >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Compact Gradient Header */}
        <div className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 px-6 py-6 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-2 right-4">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
          </div>
          
          {/* Compact Discount Icon */}
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Percent className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-1">50% OFF</h2>
          <p className="text-white text-opacity-90 font-medium text-sm">Your First Order!</p>
        </div>

        {/* Compact Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
            Exclusive First Order Discount!
          </h3>
          
          <p className="text-gray-600 text-center mb-4 text-sm leading-relaxed">
            Get <span className="font-bold text-red-600">50% off</span> your entire first order. 
            Experience our authentic traditional flavors at an unbeatable price!
          </p>

          {/* Compact Offer Details */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 mb-4 border border-red-100">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 text-sm mb-1">Exclusive First Order Discount</h4>
                <p className="text-red-700 text-xs">
                  Get 50% off on your entire first order. 
                  Experience our authentic traditional flavors at an unbeatable price! Valid for all products, free delivery included. 
                  Minimum order ₹{user ? '100' : '200'}.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mb-3">
            {user ? (
              // Logged-in user - show claim button
              <button
                onClick={handleClaimClick}
                disabled={claiming}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {claiming ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Percent className="w-4 h-4" />
                )}
                <span>
                  {claiming ? 'Claiming...' : 'Claim 50% OFF'}
                </span>
              </button>
            ) : (
              // Guest user - show login button
              <button
                onClick={handleLoginToClaimClick}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Login to Claim</span>
              </button>
            )}
          </div>

          {/* Compact terms */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              • One-time offer per customer • Minimum order ₹{user ? '100' : '200'}
            </p>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FirstOrderDiscountPopup;