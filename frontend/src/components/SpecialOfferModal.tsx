import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, ShoppingBag, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface SpecialOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpecialOfferModal: React.FC<SpecialOfferModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);

  const handleClaimOffer = async () => {
    setClaiming(true);
    
    try {
      // Close modal and navigate to free samples page
      onClose();
      navigate('/free-samples', { state: { fromOffer: true } });
    } catch (error) {
      console.error('Error navigating to free samples:', error);
    } finally {
      setClaiming(false);
    }
  };

  // Always show the modal when opened - no restrictions

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-6 py-8 text-white">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <Gift className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold">Special Offer!</h2>
                  <p className="mt-2 text-amber-100">Limited Time Only</p>
                </div>

                {/* Sparkles decoration */}
                <div className="absolute -top-2 left-4">
                  <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                </div>
                <div className="absolute top-4 right-12">
                  <Star className="h-4 w-4 text-yellow-300 animate-pulse" />
                </div>
                <div className="absolute bottom-2 left-8">
                  <Star className="h-3 w-3 text-yellow-300 animate-pulse" />
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Get 50g FREE Sample!
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    As a registered user, you're eligible for our exclusive 50g free sample pack. 
                    Try our authentic traditional products at no cost!
                  </p>
                </div>

                {/* Offer Details */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">What's Included:</h4>
                      <ul className="text-sm text-green-700 mt-1 space-y-1">
                        <li>• 50g Mixed Traditional Spices</li>
                        <li>• Premium Quality Products</li>
                        <li>• Free Home Delivery</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-xs text-gray-500 mb-6 bg-gray-50 rounded-lg p-3">
                  <p className="font-medium mb-1">Terms & Conditions:</p>
                  <ul className="space-y-1">
                    <li>• One-time offer per registered user</li>
                    <li>• Valid for first-time orders only</li>
                    <li>• Free delivery included</li>
                    <li>• Cannot be combined with other offers</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleClaimOffer}
                    disabled={claiming}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {claiming ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Claiming Offer...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Gift className="h-5 w-5" />
                        Claim Your Free Sample
                      </div>
                    )}
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SpecialOfferModal;
