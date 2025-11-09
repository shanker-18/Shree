import React from 'react';
import { X, Percent, Sparkles, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarOfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
}

const NavbarOfferPopup: React.FC<NavbarOfferPopupProps> = ({ isOpen, onClose, onClaim }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // Handle claim for logged-in users
  const handleClaimClick = () => {
    onClaim();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute top-full right-0 mt-2 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-80 max-w-sm"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-3">
              <Percent className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">50% OFF</h3>
            <p className="text-sm text-gray-600">Your First Order!</p>
          </div>

          {/* Offer Description */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 mb-4 border border-red-100">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800 font-medium mb-1">
                  Exclusive First Order Discount
                </p>
                <p className="text-xs text-red-700 leading-relaxed">
                  Get 50% off on your entire first order. Experience our authentic traditional flavors at an unbeatable price! Valid for all products, free delivery included.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {user ? (
              // Logged-in user - show claim button
              <button
                onClick={handleClaimClick}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Percent className="w-4 h-4" />
                <span>Claim Offer</span>
              </button>
            ) : (
              // Guest user - show login button
              <button
                onClick={handleLoginToClaimClick}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Login to Claim</span>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Maybe Later
            </button>
          </div>

          {/* Terms */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              • One-time offer per customer • Minimum order ₹200
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NavbarOfferPopup;