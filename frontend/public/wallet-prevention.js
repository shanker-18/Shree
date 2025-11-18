// Wallet injection prevention script
// This script prevents multiple wallet extensions from conflicting
// and causing the "Cannot redefine property: ethereum" error

(function() {
  'use strict';
  
  // Store original defineProperty to restore later if needed
  const originalDefineProperty = Object.defineProperty;
  
  // Flag to track if ethereum has been defined
  let ethereumDefined = false;
  
  // Override Object.defineProperty to handle ethereum property conflicts
  Object.defineProperty = function(obj, prop, descriptor) {
    // If trying to define ethereum property on window
    if (obj === window && prop === 'ethereum') {
      // If ethereum is already defined, silently ignore the redefinition
      if (ethereumDefined || window.ethereum) {
        console.warn('Ethereum wallet injection conflict prevented. Using existing ethereum object.');
        return obj;
      }
      // Mark as defined and proceed with original definition
      ethereumDefined = true;
    }
    
    // For all other properties or if ethereum is not yet defined, use original behavior
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  // Restore original defineProperty after a short delay to allow wallet injections to complete
  setTimeout(() => {
    Object.defineProperty = originalDefineProperty;
    console.log('Wallet injection protection disabled - normal property definitions resumed');
  }, 3000);
  
  // Additional protection: Handle evmAsk or other wallet injections
  window.addEventListener('error', function(event) {
    if (event.message && event.message.includes('Cannot redefine property: ethereum')) {
      event.preventDefault();
      console.warn('Ethereum redefinition error prevented');
      return false;
    }
  });
  
})();
