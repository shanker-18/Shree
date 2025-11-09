import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, CheckCircle, ShoppingCart, Package, Crown, Sparkles, Heart, Coffee, X, AlertCircle, ShoppingBag, Leaf, Plus, Expand } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTempSamples } from '../contexts/TempSamplesContext';
import { createOrder } from '../services/orderService';

const FreeSamplesPage: React.FC = () => {
  const [selectedBasket, setSelectedBasket] = useState<string | null>(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const { addTempSamples } = useTempSamples();
  const fromOffer = location.state?.fromOffer || false;

  // Check if user is logged in first
  useEffect(() => {
    if (!authLoading && !user) {
      // User not logged in - redirect to login (only if not loading)
      navigate('/login', { 
        state: { 
          returnTo: '/free-samples',
          message: 'Please login first to access free samples' 
        }
      });
      return;
    }

    // Check if user has already used free samples (but allow access from special offer modal)
    if (profile?.hasUsedFreeSamples && !fromOffer) {
      // Redirect to home with a message only if not coming from offer modal
      navigate('/', { 
        state: { 
          message: 'You have already claimed your free samples offer. Thank you for being a valued customer!' 
        } 
      });
    }
  }, [user, profile, navigate, fromOffer, authLoading]);

  // Comprehensive image mapping for all categories using available images
  const productImageMap: { pattern: RegExp; src: string; category?: string }[] = [
    // Mix category - exact matches with available images
    { pattern: /^puliodharai.*mix|^puliyotharai.*mix|tamarind.*mix/i, src: '/Items/Puliyotharai Mix.jpeg', category: 'Mix' },
     { pattern: /^puliyotharai.*tamarind.*mix/i, src: '/Items/Puliyotharai Mix.jpeg', category: 'Mix' },
    { pattern: /^vathakkuzhambu.*mix|vathal.*kuzhambu.*mix/i, src: '/Items/Vathakkuzhambu Mix.jpeg', category: 'Mix' },
    
    // Pickle category - exact matches with available images
    { pattern: /^poondu.*pickle/i, src: '/Items/Poondu pickle.jpeg', category: 'Pickle' },
    { pattern: /^garlic.*pickle/i, src: '/Items/Garlic Pickle.jpeg', category: 'Pickle' },
    { pattern: /^pirandai.*pickle/i, src: '/Items/Pirandai pickle.jpeg', category: 'Pickle' },
    { pattern: /^jathikkai.*pickle/i, src: '/Items/Jathikkai pickle.jpeg', category: 'Pickle' },
    { pattern: /^jadhikkai.*pickle/i, src: '/Items/Jadhikkai Pickle.jpeg', category: 'Pickle' },
    { pattern: /^mudakatthan.*pickle|^mudakkathan.*pickle/i, src: '/Items/Mudakatthan Pickle.jpeg', category: 'Pickle' },
    { pattern: /^kara.*narthangai.*pickle/i, src: '/Items/Kara narthangai pickle.jpeg', category: 'Pickle' },
    
    // Powder category - exact matches with available images
    { pattern: /^turmeric.*powder|manjal.*powder/i, src: '/Items/Turmeric Powder.jpeg', category: 'Powder' },
    { pattern: /^sambar.*powder/i, src: '/Items/Sambar powder.jpeg', category: 'Powder' },
    { pattern: /^rasam.*powder/i, src: '/Items/Rasam Powder.jpeg', category: 'Powder' },
    { pattern: /^poondu.*idly.*powder|^poondu.*idli.*powder/i, src: '/Items/Poondu Idli Powder.jpeg', category: 'Powder' },
    { pattern: /^andra.*spl.*paruppu.*powder|andhra.*spcl.*powder/i, src: '/Items/andhra spcl.jpg', category: 'Powder' },
    { pattern: /^moringa.*leaf.*powder/i, src: '/Items/moringa leaf powder.jpg', category: 'Powder' },
    { pattern: /^curry.*leaves.*powder|curry.*leaf.*powder/i, src: '/Items/curry leaf powder.jpg', category: 'Powder' },
    
    
    // Coffee category
    { pattern: /^coffee.*powder/i, src: '/Items/coffee powder.jpg', category: 'Coffee' },
    { pattern: /^coffee.*large/i, src: '/Items/Coffee large.jpg', category: 'Coffee' },
  ];

  // Product descriptions mapping
  const productDescriptions: { [key: string]: string } = {
    'puliodharai mix': 'Ready-to-cook authentic traditional tamarind rice mix',
    'vathakkuzhambu mix': 'Traditional dried vegetable gravy mix with authentic spices',
    'poondu pickle': 'Homemade garlic pickle with medicinal benefits',
    'pirandai pickle': 'Traditional pickle good for digestion and health',
    'jathikkai pickle': 'Nutmeg pickle that aids digestive function',
    'mudakkathan pickle': 'Medicinal pickle good for joint pain relief',
    'kara narthangai pickle': 'Spicy citron pickle with tangy flavor',
    'turmeric powder': 'Pure ground turmeric without additives',
    'sambar powder': 'Aromatic blend for authentic South Indian sambar',
    'rasam powder': 'Traditional spice mix for flavorful rasam',
    'ellu idli powder': 'Sesame-based powder perfect with idli and dosa',
    'poondu idly powder': 'Garlic-infused powder for enhanced taste',
    'andra spl paruppu powder': 'Andhra-style special lentil powder blend',
    'moringa leaf powder': 'Nutritious drumstick leaf powder',
    'curry leaves powder': 'Aromatic curry leaves in powder form',
    'red chilli powder': 'Fine quality red chili powder for spice',
    'ulundhu appalam': 'Premium black gram papads, crispy and healthy',
    'rice appalam': 'Traditional rice-based papads for meals',
    'kizhangu appalam': 'Tapioca-based papads with authentic taste',
    'coffee powder': 'Aromatic South Indian filter coffee powder'
  };

  // Function to get image for any product across all categories
  const getProductImage = (item: string, categoryTitle: string): string | null => {
    const lower = item.toLowerCase();
    const found = productImageMap.find((m) => {
      // If category is specified in mapping, check category match
      if (m.category && m.category !== categoryTitle) {
        return false;
      }
      return m.pattern.test(lower);
    });
    return found ? found.src : null;
  };

  // Sample baskets with predefined combinations
  const sampleBaskets = [
    {
      id: 'traditional-spice-basket',
      title: 'Traditional Spice Basket',
      description: 'Essential powders for authentic South Indian cooking',
      icon: Crown,
      gradient: 'from-red-600 to-rose-500',
      available: 50, // Available samples for this basket
      items: [
        { name: 'Turmeric powder', category: 'Powder' },
        { name: 'Sambar powder', category: 'Powder' },
        { name: 'Rasam powder', category: 'Powder' },
        { name: 'Idli powder', category: 'Powder' },
        { name: 'Red chilli powder', category: 'Powder' }
      ]
    },
    {
      id: 'pickle-lovers-basket',
      title: 'Pickle Lovers Basket',
      description: 'Traditional pickles with medicinal benefits',
      icon: Heart,
      gradient: 'from-purple-600 to-indigo-500',
      available: 40,
      items: [
        { name: 'Poondu pickle', category: 'Pickle' },
        { name: 'Pirandai pickle', category: 'Pickle' },
        { name: 'Jathikkai pickle', category: 'Pickle' },
        { name: 'Mudakkathan pickle', category: 'Pickle' }
      ]
    },
    {
      id: 'ready-cook-basket',
      title: 'Ready-to-Cook Basket',
      description: 'Instant mixes for quick traditional meals',
      icon: Package,
      gradient: 'from-amber-600 to-orange-500',
      available: 35,
      items: [
        { name: 'Puliodharai mix', category: 'Mix' },
        { name: 'Vathakkuzhambu mix', category: 'Mix' },
        { name: 'Pulikuzhambu powder', category: 'Mix' },
        { name: 'Sambar powder', category: 'Powder' },
        { name: 'Rasam powder', category: 'Powder' }
      ]
    },
    {
      id: 'healthy-choice-basket',
      title: 'Healthy Choice Basket',
      description: 'Nutritious powders with health benefits',
      icon: Leaf,
      gradient: 'from-green-600 to-emerald-500',
      available: 30,
      items: [
        { name: 'Moringa leaf powder', category: 'Powder' },
        { name: 'Curry leaves powder', category: 'Powder' },
        { name: 'Turmeric powder', category: 'Powder' },
        { name: 'Poondu idli powder', category: 'Powder' }
      ]
    },
    {
      id: 'complete-meal-basket',
      title: 'Complete Meal Basket',
      description: 'Everything you need for a traditional Tamil meal',
      icon: Gift,
      gradient: 'from-blue-600 to-purple-500',
      available: 25,
      items: [
        { name: 'Sambar powder', category: 'Powder' },
        { name: 'Rasam powder', category: 'Powder' },
        { name: 'Poondu pickle', category: 'Pickle' },
        { name: 'Puliodharai mix', category: 'Mix' },
        { name: 'Ulundhu appalam', category: 'Appalam' },
        { name: 'Coffee powder', category: 'Coffee' }
      ]
    },
    {
      id: 'beginner-basket',
      title: 'Beginner\'s Basket',
      description: 'Perfect starter pack for traditional cooking',
      icon: Sparkles,
      gradient: 'from-pink-600 to-red-500',
      available: 45,
      items: [
        { name: 'Turmeric powder', category: 'Powder' },
        { name: 'Sambar powder', category: 'Powder' },
        { name: 'Idli powder', category: 'Powder' },
        { name: 'Poondu pickle', category: 'Pickle' },
        { name: 'Puliodharai mix', category: 'Mix' }
      ]
    }
  ];

  const handleBasketSelect = (basketId: string) => {
    const basket = sampleBaskets.find(b => b.id === basketId);
    if (!basket) return;
    
    // Check if basket is available
    if (basket.available <= 0) {
      setShowLimitPopup(true);
      return;
    }
    
    // If already selected, deselect
    if (selectedBasket === basketId) {
      setSelectedBasket(null);
    } else {
      // Select this basket (only one basket can be selected)
      setSelectedBasket(basketId);
    }
  };

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (showLimitPopup) {
      const timer = setTimeout(() => {
        setShowLimitPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLimitPopup]);

  const getSelectedBasketItems = () => {
    if (!selectedBasket) return [];
    
    const basket = sampleBaskets.find(b => b.id === selectedBasket);
    if (!basket) return [];
    
    return basket.items.map(item => ({
      product_name: `${item.name} (Free Sample)`,
      quantity: 1,
      price: 0,
      category: item.category
    }));
  };

  const handleContinueWithoutProducts = async () => {
    if (!selectedBasket) return;
    if (!profile) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      const items = getSelectedBasketItems();
      
      // Navigate to order details with sample-only order
      navigate('/order-details', {
        state: {
          isAuthenticated: true,
          items: items,
          total_amount: 0,
          discount_amount: 0,
          final_amount: 0,
          isFromSamples: true,
          sampleOnly: true,
          selectedBasket: selectedBasket
        }
      });

      // Mark offer as used
      if (fromOffer) {
        await updateProfile({ hasUsedOffer: true });
      }
    } catch (error) {
      console.error('Error processing sample order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithProducts = () => {
    if (!selectedBasket) return;
    
    const basket = sampleBaskets.find(b => b.id === selectedBasket);
    if (!basket) return;
    
    // Store basket items in temporary storage
    const tempSampleItems = basket.items.map((item, index) => ({
      id: `${selectedBasket}-${index}-sample`,
      product_name: `${item.name} (Free Sample)`,
      price: 0,
      category: item.category,
      quantity: 1,
      isSample: true
    }));

    // Store samples in temporary storage
    addTempSamples(tempSampleItems);
    console.log('🆓 Stored temp samples for basket:', basket.title, tempSampleItems);

    // Set flag for 10% discount eligibility
    localStorage.setItem('hasDiscountEligibility', 'true');
    localStorage.setItem('freeSamplesClaimed', 'true');
    localStorage.setItem('selectedBasketId', selectedBasket);
    
    // Navigate to categories page (not home page)
    navigate('/categories');
  };

  // Show loading screen while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading free samples...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-red-500 to-amber-500 rounded-full">
                <Gift className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Free Sample Baskets</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose ONE basket with curated combinations of our authentic traditional products
            </p>
          </div>
        </div>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-green-800 mb-2 text-center">🎉 Special Offer</h3>
          <p className="text-green-700 text-center">
            Select ONE basket of curated products. When you order other products along with your basket, 
            you'll get an additional <span className="font-bold">10% discount</span> on all products!
          </p>
        </div>

        {/* Selection Counter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Selected Basket</h3>
            <span className="text-2xl font-bold text-red-600">
              {selectedBasket ? '1 Basket Selected' : 'No Basket Selected'}
            </span>
          </div>
          {selectedBasket && (
            <div className="mt-3">
              <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    {sampleBaskets.find(b => b.id === selectedBasket)?.title} - {sampleBaskets.find(b => b.id === selectedBasket)?.items.length} Items
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sample Baskets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBaskets.map((basket, basketIndex) => {
            const IconComponent = basket.icon;
            const isSelected = selectedBasket === basket.id;
            const isOutOfStock = basket.available <= 0;
            
            return (
              <motion.div
                key={basket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: basketIndex * 0.1 }}
                className={`
                  bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border-2
                  ${isSelected 
                    ? 'ring-4 ring-green-500 border-green-500 transform scale-105' 
                    : isOutOfStock
                    ? 'opacity-60 cursor-not-allowed border-gray-200'
                    : 'border-gray-200 hover:border-gray-300 hover:-translate-y-1'
                  }
                `}
                onClick={() => !isOutOfStock && handleBasketSelect(basket.id)}
              >
                {/* Basket Header */}
                <div className={`bg-gradient-to-r ${basket.gradient} p-6 relative`}>
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                  
                  {isOutOfStock && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      OUT OF STOCK
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-white mb-3">
                    <IconComponent className="h-8 w-8" />
                    <div>
                      <h3 className="text-xl font-bold">{basket.title}</h3>
                      <p className="text-white/90 text-sm">{basket.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-white/90 text-sm">
                    <span>{basket.items.length} Products Included</span>
                    <span className="bg-white/20 px-2 py-1 rounded">{basket.available} Available</span>
                  </div>
                </div>

                {/* Basket Items Preview */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                  <div className="space-y-2">
                    {basket.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>{item.name}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{item.category}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Value Display */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-green-600">FREE</span>
                        <span className="text-sm text-gray-500 ml-2 line-through">₹{basket.items.length * 50}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Value</div>
                        <div className="text-lg font-bold text-gray-900">₹{basket.items.length * 50}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selection Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      !isOutOfStock && handleBasketSelect(basket.id);
                    }}
                    disabled={isOutOfStock}
                    className={`
                      w-full mt-4 py-3 px-4 rounded-lg font-semibold transition-all duration-200
                      ${isSelected
                        ? 'bg-green-600 text-white'
                        : isOutOfStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600'
                      }
                    `}
                  >
                    {isSelected ? 'Selected ✓' : isOutOfStock ? 'Out of Stock' : 'Select This Basket'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 p-6 mt-8 -mx-4">
          <div className="max-w-7xl mx-auto">
            {/* Instructions */}
            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm">
                Choose what you'd like to do with your selected basket:
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Continue without any product */}
              <button
                onClick={handleContinueWithoutProducts}
                disabled={!selectedBasket || loading}
                className={`
                  flex-1 px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300
                  ${selectedBasket
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Gift className="h-5 w-5" />
                {loading ? 'Processing...' : selectedBasket ? `Order Basket Samples Only` : 'Select a Basket First'}
              </button>
              
              {/* Continue to order with products */}
              <button
                onClick={handleContinueWithProducts}
                disabled={!selectedBasket}
                className={`
                  flex-1 px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300
                  ${selectedBasket
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <ShoppingBag className="h-5 w-5" />
                Add Basket + Shop for 10% OFF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basket Unavailable Popup */}
      <AnimatePresence>
        {showLimitPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed top-20 right-4 z-50 max-w-sm"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-red-200 p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Basket Unavailable</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This basket is currently out of stock. Please choose a different basket from the available options.
                  </p>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => setShowLimitPopup(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FreeSamplesPage;
