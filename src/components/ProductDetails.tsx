import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Plus, Check, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTempSamples } from '../contexts/TempSamplesContext';
import AuthModal from './AuthModal';
import { isProductAvailable, allowedWeightsForProduct, weightToFolder } from '../data/availability';

interface ProductDetailsProps {}

const ProductDetails: React.FC<ProductDetailsProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [selectedWeights, setSelectedWeights] = useState<('250g'|'500g'|'1kg')[]>(['500g']);
  const [quantity, setQuantity] = useState(1 as number);
  const { user } = useAuth();
  const { tempSamples, hasTempSamples } = useTempSamples();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Debug: Check temp samples on component mount
  console.log('📱 ProductDetails mounted with temp samples:', { tempSamples, hasSamples: hasTempSamples(), count: tempSamples?.length });
  
  // Get product details from location state
  const { product } = location.state || {};
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been moved.</p>
          <Link to="/">
            <button className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-300">Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  const { name, category, description, price, image } = product;
  const isAvailable = isProductAvailable(name);
  
  // Image/Buy gating based on known image-backed products
  const lower = name.toLowerCase();
  const isVathak = lower.includes('vathakkuzhambu') || lower.includes('vathakulambu');
  const isPuliyo = lower.includes('puliyotharai') || lower.includes('puliodharai');
  const isPoondu = (lower.includes('poondu') || lower.includes('poondhu')) && (lower.includes('idli') || lower.includes('idly'));
  const isAndra = (lower.includes('andra') || lower.includes('andhra')) && (lower.includes('spl') || lower.includes('special')) && lower.includes('paruppu') && lower.includes('powder');
  const isHealth = lower.includes('health mix') || lower.includes('healthmix');
  const isTurmeric = (lower.includes('turmeric') || lower.includes('manjal')) && lower.includes('powder');
  const isCoffee = lower.includes('coffee') && lower.includes('powder');
  const hasImageProduct = isVathak || isPuliyo || isPoondu || isAndra || isHealth || isTurmeric || isCoffee;
  
  // Resolve image from Images/<weight>/<name>.(jpg|png|webp)
  const allowed = allowedWeightsForProduct(name);
  
  // Initialize selectedWeights based on allowed weights when product changes
  useEffect(() => {
    if (allowed.length > 0) {
      setSelectedWeights([allowed[0] as '250g'|'500g'|'1kg']);
    } else {
      setSelectedWeights(['500g']);
    }
  }, [name, allowed]);
  const preferredWeight = (selectedWeights[selectedWeights.length-1] || allowed[0] || '500g') as ('250g'|'500g'|'1kg');
  const weightFolder = weightToFolder(preferredWeight);
  const basePath = `/Images/${weightFolder}/${name}`;
  const resolvedImage = useMemo(() => {
    // Per-product override first
    // Lazy import to avoid circular deps
    try {
      const { getImageOverride } = require('../data/imageOverrides');
      const o = getImageOverride(name, preferredWeight);
      if (o) return o;
    } catch {}
    // Default to webp in computed folder
    return `${basePath}.webp`;
  }, [basePath, name, preferredWeight]);
  
  const handleAddToCart = () => {
    const weights = selectedWeights.length ? selectedWeights : ['500g'];
    weights.forEach((w) => {
      addToCart({ product_name: `${name} (${w})`, category, price, quantity });
    });
  };

  const handleBuyNow = () => {
    console.log('🚀 ProductDetails handleBuyNow called');
    console.log('📊 TempSamples context state:', { tempSamples, hasTempSamples: hasTempSamples(), count: tempSamples?.length });
    
    // Create current product item
    // Build items for selected weights (support multiple variants)
    const weights = selectedWeights.length ? selectedWeights : ['500g'];
    const currentProductItems = weights.map(w => ({
      product_name: `${name} (${w})`,
      quantity,
      price,
      category,
      isSample: false
    }));

    // Merge temp samples with current product
    const allItems = hasTempSamples() ? [...tempSamples, ...currentProductItems] : [...currentProductItems];
    console.log('🛒 Merging items for buy now:', { tempSamples, currentProduct: currentProductItems, allItems });
    console.log('🎯 Final merged items count:', allItems.length);

    // Calculate totals (samples are free)
    const productTotal = price * quantity * (selectedWeights.length ? selectedWeights.length : 1);
    let discountAmount = 0;
    let finalAmount = productTotal;

    // Apply 10% discount if there are samples
    if (hasTempSamples() && localStorage.getItem('hasDiscountEligibility') === 'true') {
      discountAmount = productTotal * 0.1;
      finalAmount = productTotal - discountAmount;
    }

    // Check if user is already authenticated
    if (user) {
      // User is logged in, go directly to order details
      navigate('/order-details', {
        state: {
          isAuthenticated: true,
          productName: `${name}${selectedWeights.length>1?'' : ` (${preferredWeight})`}`,
          category,
          price: price * quantity * (selectedWeights.length ? selectedWeights.length : 1),
          items: allItems,
          total_amount: productTotal,
          discount_amount: discountAmount,
          final_amount: finalAmount,
          isFromBuyNow: true,
          hasTempSamples: hasTempSamples()
        }
      });
    } else {
      // User is not logged in, show auth modal
      localStorage.setItem('pendingProduct', JSON.stringify({ name: `${name}${selectedWeights.length>1?'' : ` (${preferredWeight})`}`, category, price: productTotal, items: allItems, total_amount: productTotal, discount_amount: discountAmount, final_amount: finalAmount }));
      setShowAuthModal(true);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleSignIn = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  const handleGuest = () => {
    setShowAuthModal(false);
    
    // Get merged product data from localStorage
    const pendingProduct = JSON.parse(localStorage.getItem('pendingProduct') || '{}');
    
    navigate('/order-details', {
      state: {
        isAuthenticated: false,
        productName: pendingProduct.name || name,
        category: pendingProduct.category || category,
        price: pendingProduct.price || price,
        items: pendingProduct.items || [{
          product_name: name,
          quantity: 1,
          price,
          category
        }],
        total_amount: pendingProduct.total_amount || price,
        discount_amount: pendingProduct.discount_amount || 0,
        final_amount: pendingProduct.final_amount || price,
        isFromBuyNow: true,
        hasTempSamples: hasTempSamples()
      }
    });
  };

  // Determine category color scheme
  const getCategoryStyle = (categoryName: string) => {
    const categoryMap: Record<string, { gradient: string, bgColor: string, borderColor: string, textColor: string }> = {
      'Powders': {
        gradient: "from-red-600 to-rose-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
      },
      'Mixes': {
        gradient: "from-amber-600 to-orange-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-800",
      },
      'Vathal': {
        gradient: "from-blue-600 to-indigo-500",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
        textColor: "text-indigo-800",
      },
      'Appalam': {
        gradient: "from-emerald-600 to-green-500",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-800",
      },
      'Pickles': {
        gradient: "from-purple-600 to-indigo-500",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-800",
      },
      'Oils': {
        gradient: "from-yellow-600 to-amber-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-800",
      },
    };
    
    return categoryMap[categoryName] || {
      gradient: "from-gray-600 to-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-800",
    };
  };

  const categoryStyle = getCategoryStyle(category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/25 to-blue-300/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-sm">
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Back to {category}</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${categoryStyle.gradient} p-6 md:p-8`}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>
              <div className="flex items-center">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">{category}</span>
                {hasImageProduct ? (
                  <span className="ml-4 text-white/90 text-lg font-semibold">₹{price}</span>
                ) : (
                  <span className="ml-4 text-white/90 text-lg font-semibold opacity-80">Coming soon</span>
                )}
              </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            <div>
              {/* Show image only for Vathakkuzhambu Mix; others keep a clean placeholder */}
              {(() => {
                const lower = name.toLowerCase();
                const isVathak = lower.includes('vathakkuzhambu') || lower.includes('vathakulambu');
                const isPuliyo = lower.includes('puliyotharai') || lower.includes('puliodharai');
                const isPoondu = (lower.includes('poondu') || lower.includes('poondhu')) && (lower.includes('idli') || lower.includes('idly'));
                const isAndra = (lower.includes('andra') || lower.includes('andhra')) && (lower.includes('spl') || lower.includes('special')) && lower.includes('paruppu') && lower.includes('powder');
                const isHealth = lower.includes('health mix') || lower.includes('healthmix');
                const isTurmeric = (lower.includes('turmeric') || lower.includes('manjal')) && lower.includes('powder');
                const isCoffee = lower.includes('coffee') && lower.includes('powder');
                if (isVathak || isPuliyo || isPoondu || isAndra || isHealth || isTurmeric || isCoffee) {
                  const prodName = isVathak
                    ? 'Vathakkuzhambu Mix'
                    : isPuliyo
                      ? 'Puliyotharai Mix'
                      : isPoondu
                        ? 'Poondu Idli Powder'
                        : isHealth
                          ? 'Health Mix'
                          : isTurmeric
                            ? 'Turmeric Powder'
                            : isCoffee
                              ? 'Coffee powder'
                              : 'Andra Spl Paruppu Powder';
                  const candidates = [
                    `/Images/250/${prodName}.jpg`,
                    `/Images/250/${prodName}.jpeg`,
                    `/Images/100/${prodName}.jpg`,
                    `/Images/100/${prodName}.jpeg`,
                    `/Images/500/${prodName}.jpg`,
                    `/Images/1kg/${prodName}.jpg`
                  ];
                  return (
                    <div className={`w-full h-96 ${categoryStyle.bgColor} border ${categoryStyle.borderColor} rounded-xl overflow-hidden p-6 shadow-lg`}>
                      <img
                        src={candidates[0]}
                        data-fallback={candidates.slice(1).join(',')}
                        alt={name}
                        className="w-full h-full object-contain object-center p-3 bg-white rounded"
                        onError={(e:any)=>{
                          const el = e.currentTarget as HTMLImageElement;
                          const list = (el.getAttribute('data-fallback')||'').split(',').filter(Boolean);
                          if (list.length) { el.src = list.shift() as string; el.setAttribute('data-fallback', list.join(',')); } else { el.style.display='none'; }
                        }}
                      />
                    </div>
                  );
                }
                return (
                  <div className={`w-full h-96 ${categoryStyle.bgColor} border ${categoryStyle.borderColor} rounded-xl overflow-hidden p-6 shadow-lg`}>
                    <div className="w-full h-full bg-gradient-to-br from-white/60 to-white/30 rounded-xl" />
                  </div>
                );
              })()}
              
              {/* Temp Samples Indicator */}
              {hasTempSamples() && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {tempSamples.length} free sample{tempSamples.length > 1 ? 's' : ''} will be included
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    You'll get 10% discount on this product!
                  </p>
                </div>
              )}
              
              {/* Weight selector and quantity */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex gap-2">
                  {(allowed.length ? allowed : (['500g','1kg'] as const)).map(w => (
                    <button
                      key={w}
                      onClick={() => {
                        setSelectedWeights(prev => prev.includes(w) ? prev.filter(x=>x!==w) : [...prev, w]);
                      }}
                      className={`px-3 py-1.5 rounded-full border text-sm ${selectedWeights.includes(w) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}
                      title={`Select ${w}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-sm text-gray-600">Qty</span>
                  <input type="number" min={1} value={quantity} onChange={e=>setQuantity(Math.max(1, parseInt(e.target.value||'1')))} className="w-16 border rounded px-2 py-1" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {hasImageProduct ? (
                  <button 
                    onClick={handleBuyNow}
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white font-medium py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Buy Now{hasTempSamples() ? ' + Samples' : ''}</span>
                  </button>
                ) : (
                  <div className="col-span-1 flex items-center justify-center bg-gray-100 text-gray-600 font-semibold rounded-lg">Coming soon</div>
                )}
                
                <button 
                  onClick={handleContinueShopping}
                  className="bg-gradient-to-r from-amber-600 to-orange-500 text-white font-medium py-3 px-6 rounded-lg hover:from-amber-700 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className={`${categoryStyle.bgColor} ${categoryStyle.borderColor} border rounded-xl p-6`}>
                <p className="text-gray-700 leading-relaxed">{description}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Category:</span>
                      <span className="text-gray-800 font-medium">{category}</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Price:</span>
                      {hasImageProduct ? (
                        <span className="text-gray-800 font-medium">₹{price}</span>
                      ) : (
                        <span className="text-gray-500 font-medium">Coming soon</span>
                      )}
                    </li>
                    <li className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Availability:</span>
                      <span className="text-green-600 font-medium">In Stock</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSignIn={handleSignIn} 
        onGuest={handleGuest} 
      />
    </div>
  );
};

export default ProductDetails;