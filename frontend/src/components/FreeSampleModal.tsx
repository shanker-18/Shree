import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, CheckCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface FreeSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREE_SAMPLE_ITEMS = [
  { id: 'turmeric-powder', name: 'Turmeric Powder', category: 'Powders' },
  { id: 'idly-powder', name: 'Idly Powder', category: 'Powders' },
  { id: 'rasam-powder', name: 'Rasam Powder', category: 'Powders' },
  { id: 'pai-appalam', name: 'Pai Appalam', category: 'Appalam' },
  { id: 'lemon-pickle', name: 'Lemon Pickle', category: 'Pickles' },
  { id: 'coconut-oil', name: 'Coconut Oil', category: 'Oils' },
  { id: 'puliyotharai-mix', name: 'Puliyotharai Mix', category: 'Mixes' },
  { id: 'sundakkai-vathal', name: 'Sundakkai Vathal', category: 'Vathal' },
  { id: 'milagu-powder', name: 'Milagu Powder', category: 'Powders' },
  { id: 'garlic-appalam', name: 'Garlic Appalam', category: 'Appalam' }
];

const FreeSampleModal: React.FC<FreeSampleModalProps> = ({ isOpen, onClose }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { addToCart } = useCart();

  const handleItemToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else if (selectedItems.length < 7) {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleAddToCart = () => {
    // Add selected free samples to cart
    selectedItems.forEach(itemId => {
      const item = FREE_SAMPLE_ITEMS.find(i => i.id === itemId);
      if (item) {
        addToCart({
          id: `${item.id}-sample`,
          name: `${item.name} (Free Sample)`,
          price: 0,
          category: item.category,
          image: '/placeholder-product.jpg',
          isSample: true
        }, 1);
      }
    });

    // Store in localStorage that user has claimed free samples
    localStorage.setItem('freeSamplesClaimed', 'true');
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-full">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Free Samples!</h2>
                <p className="text-gray-600">Choose up to 7 items to try for free</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Offer Details */}
          <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">Special Offer</h3>
            <p className="text-red-700 text-sm">
              Select up to 7 free sample items. When you add other products to your cart along with these samples, 
              you'll get an additional <span className="font-bold">25% discount</span> on your entire order!
            </p>
          </div>

          {/* Item Selection */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Choose Your Samples</h3>
              <span className="text-sm text-gray-500">
                {selectedItems.length}/7 selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FREE_SAMPLE_ITEMS.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                const isDisabled = !isSelected && selectedItems.length >= 7;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleItemToggle(item.id)}
                    disabled={isDisabled}
                    className={`
                      p-3 rounded-lg border text-left transition-all duration-200
                      ${isSelected 
                        ? 'border-red-500 bg-red-50 text-red-800' 
                        : isDisabled 
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                      }
                    `}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleAddToCart}
              disabled={selectedItems.length === 0}
              className={`
                flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors
                ${selectedItems.length > 0
                  ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white hover:from-red-600 hover:to-amber-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart ({selectedItems.length} items)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FreeSampleModal;
