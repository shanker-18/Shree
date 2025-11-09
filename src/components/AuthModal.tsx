import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, UserCheck, ShoppingBag } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onGuest: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSignIn, onGuest }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Continue Shopping</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Sign In Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSignIn}
              className="w-full p-4 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 text-lg">Sign In</h3>
                  <p className="text-sm text-gray-600">Access your account and order history</p>
                </div>
              </div>
            </motion.button>

            {/* Guest Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGuest}
              className="w-full p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 text-lg">Continue as Guest</h3>
                  <p className="text-sm text-gray-600">Quick checkout without account</p>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our terms of service and privacy policy
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
