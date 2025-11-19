import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, UserCircle2, CheckCircle, Gift, ChevronRight, User, ShoppingBag, LogOut, Sparkles, Menu, X, MapPin } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth, Address } from '../contexts/AuthContext';
import GuestEmailModal from './GuestEmailModal';
import AddressModal from './AddressModal';
import { useFirstOrderPopup } from '../hooks/useFirstOrderPopup';
import { categories } from '../data/categories';
import { toSlug } from '../utils/slugUtils';
import NavbarOfferPopup from './NavbarOfferPopup';

const HIDE_ON: string[] = ['/order-details', '/order-summary'];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { profile, logout, savedAddress, saveAddress } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const { shouldShowPopup, showPopup } = useFirstOrderPopup();
  
  // Helper to navigate to a section on the homepage (e.g. #about, #contact, #categories)
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Check if user has completed their first order
  const hasCompletedFirstOrder = profile?.id ? localStorage.getItem(`firstOrderCompleted_${profile.id}`) === 'true' : false;
  
  // State for navbar offer popup
  const [isOfferPopupOpen, setIsOfferPopupOpen] = useState(false);
  const offerPopupRef = useRef<HTMLDivElement>(null);
  
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (offerPopupRef.current && !offerPopupRef.current.contains(event.target as Node)) {
        setIsOfferPopupOpen(false);
      }
    };

    if (isOfferPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOfferPopupOpen]);
  
  const handleOfferButtonClick = () => {
    // Toggle the small popup
    setIsOfferPopupOpen(!isOfferPopupOpen);
  };
  
  const handleClaimOfferFromPopup = () => {
    // Get available categories for random selection
    const availableCategories = categories.map(cat => toSlug(cat.title));
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    
    // Navigate to random category page
    navigate(`/category/${randomCategory}`);
    
    // Ongoing offer: no claim tracking required
    
    // Close the popup
    setIsOfferPopupOpen(false);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hide = HIDE_ON.some((p) => location.pathname.startsWith(p));
  if (hide) return null;
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGuestEmailSubmit = (email: string) => {
    // Store guest email in localStorage or state management
    localStorage.setItem('guestEmail', email);
    // Close the modal
    setShowGuestModal(false);
  };

  const handleSaveAddress = async (address: Address) => {
    try {
      const result = await saveAddress(address);
      if (result.success) {
        console.log('Address saved successfully!');
        setIsAddressModalOpen(false);
      } else {
        console.error('Failed to save address:', result.error);
        alert('Failed to save address. Please try again.');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('An error occurred while saving address.');
    }
  };

  return (
    <>
      <GuestEmailModal 
        isOpen={showGuestModal} 
        onClose={() => setShowGuestModal(false)} 
        onSubmit={handleGuestEmailSubmit} 
      />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        initialAddress={savedAddress}
      />
      <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-gray-200">
            <img 
              src="/Items/top.png" 
              alt="Shree Raaga SWAAD GHAR" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-full"
              onError={(e) => {
                // Fallback to SR text if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="hidden text-red-600 font-bold text-lg tracking-wide">SR</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-red-600 transition-colors duration-200">Home</Link>
          <Link to="/category/mix-pickle" className="hover:text-red-600 transition-colors duration-200">Mix & Pickle</Link>
          <Link to="/category/powder" className="hover:text-red-600 transition-colors duration-200">Powder</Link>
          <Link to="/category/appalam" className="hover:text-red-600 transition-colors duration-200">Appalam</Link>
          <Link to="/category/coffee" className="hover:text-red-600 transition-colors duration-200">Coffee</Link>
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className="hover:text-red-600 transition-colors duration-200"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="hover:text-red-600 transition-colors duration-200"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('upcoming-products')}
            className="hover:text-red-600 transition-colors duration-200"
          >
            Coming Soon
          </button>
          
          {/* Permanent Claim Offer Button with Popup */}
          <div className="relative" ref={offerPopupRef}>
            <button
              onClick={handleOfferButtonClick}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg transition-all duration-300 transform bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-xl hover:scale-105 animate-pulse"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Raaga Saver</span>
              <Gift className="h-3 w-3 animate-spin" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-bounce"></div>
            </button>
            
            {/* Small Offer Popup */}
            <NavbarOfferPopup 
              isOpen={isOfferPopupOpen}
              onClose={() => setIsOfferPopupOpen(false)}
              onClaim={handleClaimOfferFromPopup}
            />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 sm:p-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-gray-100 transition-colors duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </button>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* User Account - Shown when logged in */}
          {profile ? (
            <div className="relative group">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group-hover:scale-105 cursor-pointer">
                <UserCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-green-700 hidden lg:inline">{profile.name}</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
              </div>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
                  {profile.emailVerified ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      Unverified
                    </span>
                  )}
                </div>
                
                {/* First-time user offer */}
                {profile.isFirstTimeOrder && (
                  <div className="p-2 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Gift className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-800">New User Offer!</p>
                        <p className="text-xs text-amber-700">Free 50g sample with your first order</p>
                      </div>
                    </div>
                    <a 
                      href="/#categories" 
                      className="mt-1 text-xs font-medium text-amber-600 hover:text-amber-800 flex items-center justify-end"
                    >
                      Shop now <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>
                )}
                
                <div className="p-1">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    User Details
                  </Link>
                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {savedAddress ? 'Edit Address' : 'Add Address'}
                  </button>
                  <a href="/#categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-gray-500" />
                    Order Products
                  </a>
                  <button 
                    onClick={async () => {
                      await logout();
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200">
                Sign In
              </Link>
              <Link to="/register" className="px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-amber-500 rounded-full hover:from-red-600 hover:to-amber-600 transition-colors duration-300">
                Register
              </Link>
            </div>
          )}
          
          {/* Cart */}
          <Link to="/cart" className="relative group">
            <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-red-50 to-amber-50 hover:from-red-100 hover:to-amber-100 transition-all duration-300 group-hover:scale-110">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              {getCartCount() > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {getCartCount() > 99 ? '99+' : getCartCount()}
                </div>
              )}
            </div>
          </Link>

          {/* Shop Button */}
          <button
            type="button"
            onClick={() => scrollToSection('categories')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>Shop Now</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-14 sm:top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2">
            <Link 
              to="/" 
              className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/category/mix-pickle"
              className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mix & Pickle
            </Link>
            <Link 
              to="/category/powder"
              className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Powder
            </Link>
            <Link 
              to="/category/appalam"
              className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Appalam
            </Link>
            <Link 
              to="/category/coffee"
              className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Coffee
            </Link>
            <button 
              type="button"
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => {
                scrollToSection('about');
                setIsMobileMenuOpen(false);
              }}
            >
              About
            </button>
            <button 
              type="button"
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => {
                scrollToSection('contact');
                setIsMobileMenuOpen(false);
              }}
            >
              Contact
            </button>
            <button 
              type="button"
              className="block w-full text-left px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => {
                scrollToSection('upcoming-products');
                setIsMobileMenuOpen(false);
              }}
            >
              Coming Soon
            </button>
            
            {/* Mobile Permanent Claim Offer Button with Popup */}
            <div className="relative mt-3">
              <button
                type="button"
                onClick={() => {
                  setIsOfferPopupOpen(!isOfferPopupOpen);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-bold shadow-lg transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
              >
                <Sparkles className="h-4 w-4" />
                <span>Raaga Saver</span>
                <Gift className="h-3 w-3 animate-spin" />
              </button>
              
              {/* Mobile Small Offer Popup */}
              <div className="relative">
                <NavbarOfferPopup 
                  isOpen={isOfferPopupOpen}
                  onClose={() => setIsOfferPopupOpen(false)}
                  onClaim={() => {
                    handleClaimOfferFromPopup();
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
            
            {/* Mobile User Options */}
            {profile ? (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="px-4 py-2 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-700">{profile.name}</p>
                  <p className="text-xs text-green-600">Signed in</p>
                </div>
                
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 text-green-600" />
                  User Details
                </Link>
                
                <button
                  onClick={() => {
                    setIsAddressModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {savedAddress ? 'Edit Address' : 'Add Address'}
                </button>
                
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link 
                  to="/login" 
                  className="block px-4 py-2 text-center text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="block px-4 py-2 text-center text-white bg-gradient-to-r from-red-500 to-amber-500 rounded-lg hover:from-red-600 hover:to-amber-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Navbar;


