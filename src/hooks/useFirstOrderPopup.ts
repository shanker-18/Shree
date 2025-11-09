import { useState, useEffect } from 'react';
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
  // This ensures maximum visibility of the 50% offer
  // Popup will appear on every page load/refresh except excluded pages
  const shouldShowPopup = true;

  useEffect(() => {
    // Check if popup has been claimed before
    const popupClaimed = localStorage.getItem(FIRST_ORDER_DISCOUNT_CLAIMED_KEY) === 'true';
    setHasBeenClaimed(popupClaimed);
    
    // Reset session storage on every page load to show popup on every refresh
    setHasBeenShown(false);

    // Debug logging
    console.log('🎪 FirstOrderPopup Debug:', {
      user: !!user,
      userId: user?.id,
      shouldShowPopup,
      currentPath: window.location.pathname
    });

    // Show popup on every visit/refresh for maximum visibility
    // Only exclude specific pages where it might interrupt user flow
    const currentPath = window.location.pathname;
    const excludedPages = ['/login', '/register', '/forgot-password'];
    const isExcludedPage = excludedPages.includes(currentPath);
    
    if (shouldShowPopup && !isExcludedPage) {
      // Small delay to ensure page is loaded
      console.log('🎪 Setting popup to show in 2 seconds...');
      const timer = setTimeout(() => {
        console.log('🎪 Showing popup now!');
        setIsVisible(true);
        setHasBeenShown(true);
      }, 2000); // 2 second delay for better UX
      
      return () => clearTimeout(timer);
    } else {
      console.log('🎪 Popup not showing on excluded page:', { isExcludedPage, currentPath });
    }
  }, [user, shouldShowPopup]);

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
    localStorage.setItem(FIRST_ORDER_DISCOUNT_CLAIMED_KEY, 'true');
    // Don't set session storage so popup can appear on refresh
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.innerHTML = '🎉 50% OFF Discount Claimed! Taking you to our products...';
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
  console.log('🛠️ Debug: You can reset first order popup state by running: resetFirstOrderPopupState()');
}