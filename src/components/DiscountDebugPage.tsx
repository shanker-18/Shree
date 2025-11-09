import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { hasUserClaimedFirstOrderDiscount, resetFirstOrderPopupState } from '../hooks/useFirstOrderPopup';

const DiscountDebugPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { getDiscountInfo } = useCart();

  const handleResetDiscount = () => {
    resetFirstOrderPopupState();
    localStorage.removeItem('firstOrderDiscountUsed');
    localStorage.removeItem('firstOrderDiscountClaimed');
    
    // Reset user profile and first order completion
    if (user?.id) {
      localStorage.removeItem(`firstOrderCompleted_${user.id}`);
      const savedProfile = localStorage.getItem(`profile_${user.id}`);
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        profileData.hasUsedOffer = false;
        profileData.offerClaimed = false;
        profileData.isFirstTimeOrder = true;
        localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData));
      }
    }
    alert('Discount state reset! Refresh the page to see the popup again.');
  };

  const discountInfo = getDiscountInfo();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Discount Debug Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">User Information</h2>
            <div className="space-y-2">
              <p><strong>Logged In:</strong> {user ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Name:</strong> {profile?.name || 'N/A'}</p>
              <p><strong>Is First Time Order:</strong> {profile?.isFirstTimeOrder ? 'Yes' : 'No'}</p>
              <p><strong>Has Used Offer:</strong> {profile?.hasUsedOffer ? 'Yes' : 'No'}</p>
              <p><strong>Offer Claimed:</strong> {profile?.offerClaimed ? 'Yes' : 'No'}</p>
              <p><strong>First Order Completed:</strong> {user?.id ? localStorage.getItem(`firstOrderCompleted_${user.id}`) === 'true' ? 'Yes' : 'No' : 'N/A'}</p>
            </div>
          </div>

          {/* Discount State */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Discount State</h2>
            <div className="space-y-2">
              <p><strong>Discount Claimed (Global):</strong> {localStorage.getItem('firstOrderDiscountClaimed') || 'No'}</p>
              <p><strong>Discount Used (Global):</strong> {localStorage.getItem('firstOrderDiscountUsed') || 'No'}</p>
              <p><strong>User Claimed Discount:</strong> {user ? hasUserClaimedFirstOrderDiscount(user.id) ? 'Yes' : 'No' : 'N/A'}</p>
              <p><strong>Popup Shown (Session):</strong> {sessionStorage.getItem('first_order_popup_shown') || 'No'}</p>
            </div>
          </div>

          {/* Current Discount Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Current Cart Discount</h2>
            <div className="space-y-2">
              <p><strong>Discount Type:</strong> {discountInfo.type}</p>
              <p><strong>Discount Percentage:</strong> {discountInfo.percentage}%</p>
              <p><strong>Discount Amount:</strong> ₹{discountInfo.amount}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Debug Actions</h2>
            <div className="space-y-4">
              <button
                onClick={handleResetDiscount}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Reset All Discount State
              </button>
              
              <button
                onClick={() => {
                  sessionStorage.removeItem('first_order_popup_shown');
                  alert('Session popup state cleared! Refresh to potentially see popup.');
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Clear Session Popup State
              </button>
              
              <button
                onClick={() => {
                  if (user?.id) {
                    localStorage.setItem('firstOrderDiscountClaimed', 'true');
                    localStorage.setItem(`firstOrderDiscount_${user.id}`, 'true');
                    alert('Discount marked as claimed!');
                  } else {
                    alert('Please login first!');
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Mark Discount as Claimed
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            This debug panel helps you test the first-order discount functionality. 
            Use the reset button to test the popup flow again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscountDebugPage;