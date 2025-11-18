import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Keys for storing popup state in localStorage
const FIRST_ORDER_POPUP_SHOWN_KEY = 'first_order_popup_shown';
const FIRST_ORDER_DISCOUNT_CLAIMED_KEY = 'firstOrderDiscountClaimed';

interface UseFirstOrderPopupReturn {
  isVisible: boolean;
  showPopup: () => void;
  hidePopup: () => void;
  onClaim: () => void;
  hasBeenShown: boolean;
  hasBeenClaimed: boolean;
  shouldShowPopup: boolean;
}

export const useFirstOrderPopup = (): UseFirstOrderPopupReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [hasBeenClaimed, setHasBeenClaimed] = useState(false);
  const { user, profile } = useAuth();

  // Always show popup on every visit and refresh for all users
  // Popup will appear on every page load/refresh except excluded pages
  const shouldShowPopup = true;
  const lastShownPathRef = useRef<string | null>(null);
  
  useEffect(() => {
    // Check if popup has been claimed before
    const popupClaimed = localStorage.getItem(FIRST_ORDER_DISCOUNT_CLAIMED_KEY) === 'true';
    setHasBeenClaimed(popupClaimed);

    // Show on every mount (after a short delay) except on excluded pages
    const currentPath = window.location.pathname;
    const excludedPages = ['/login', '/register', '/forgot-password', '/order-details', '/order-summary'];
    const isExcludedPage = excludedPages.includes(currentPath);
    
    if (shouldShowPopup && !isExcludedPage) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowPopup]);

  const showPopup = () => {
    if (shouldShowPopup) {
      setIsVisible(true);
    }
  };

  const hidePopup = () => {
    setIsVisible(false);
    setHasBeenShown(true);
    // Don't store in session/local storage so popup shows again on refresh
    // This ensures the popup appears on every visit as requested
  };

  const onClaim = () => {
    setIsVisible(false);
    setHasBeenClaimed(true);
    setHasBeenShown(true);
    // Ongoing offer: no claim flag needed in localStorage
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.innerHTML = '🎉 Offer ready! Place an order for ₹500 or more and get 15% off on the total.';
    document.body.appendChild(successMessage);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.parentNode.removeChild(successMessage);
      }
    }, 5000);
  };

  return {
    isVisible,
    showPopup,
    hidePopup,
    onClaim,
    hasBeenShown,
    hasBeenClaimed,
    shouldShowPopup: Boolean(shouldShowPopup)
  };
};

// Utility functions for checking popup state
export const hasUserClaimedFirstOrderDiscount = (userId?: string): boolean => {
  if (!userId) return localStorage.getItem(FIRST_ORDER_DISCOUNT_CLAIMED_KEY) === 'true';
  return localStorage.getItem(`firstOrderDiscount_${userId}`) === 'true' || 
         localStorage.getItem(FIRST_ORDER_DISCOUNT_CLAIMED_KEY) === 'true';
};

// Reset popup state (useful for testing or admin purposes)
export const resetFirstOrderPopupState = (): void => {
  localStorage.removeItem(FIRST_ORDER_DISCOUNT_CLAIMED_KEY);
  sessionStorage.removeItem(FIRST_ORDER_POPUP_SHOWN_KEY);
  
  // Also clear user-specific keys
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('firstOrderDiscount_')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('🧹 First order popup state reset - popup will show again on next page load');
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).resetFirstOrderPopupState = resetFirstOrderPopupState;
  (window as any).hasUserClaimedFirstOrderDiscount = hasUserClaimedFirstOrderDiscount;
}