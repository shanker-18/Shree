import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toSlug } from '../utils/slugUtils';
import { ChevronRight, ChevronLeft, ShoppingCart, Plus, Check, CheckCircle, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTempSamples } from '../contexts/TempSamplesContext';
import AuthModal from './AuthModal';
import { isProductAvailable, allowedWeightsForProduct, weightToFolder, getProductPrice } from '../data/availability';
import { categories } from '../data/categories';

interface ProductDetailsProps {}

const ProductDetails: React.FC<ProductDetailsProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  // Include 100g in the union for broader compatibility across products
  const [selectedWeights, setSelectedWeights] = useState<('100g'|'250g'|'500g')[]>(['500g']);
  // Track quantity per selected weight, defaulting to 1
  const [quantities, setQuantities] = useState<{[key: string]: number}>({ '100g': 1, '250g': 1, '500g': 1 });
  const { user } = useAuth();
  const { tempSamples, hasTempSamples } = useTempSamples();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
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

  // Build richer description from categories (use CategoryPage content logic)
  const categoryObj = useMemo(() => categories.find(c => c.title === category), [category]);
  const getItemTitle = (item: string): string => (item.includes(':') ? item.split(':')[0].trim() : item);
  const getRichDescription = (productName: string): string => {
    const fullItem = categoryObj?.items.find(item => {
      if (item.includes(':')) return getItemTitle(item) === productName;
      if (productName === 'Koozh Vathal') return item === 'Koozh Vathal';
      return getItemTitle(item) === productName;
    });
    if (fullItem) {
      if (fullItem.includes(':')) return `${productName}: ${fullItem.split(':')[1].trim()}`;
      if (productName === 'Koozh Vathal') return 'Koozh Vathal - Prepared from wet-ground boiled rice with salt and spices.';
    }
    // fallback to provided description or a generic one
    return description || `${productName} - A quality product from our ${category} collection.`;
  };
  const richDescription = useMemo(() => getRichDescription(name), [name, categoryObj]);
  
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
  const allowedMemo = useMemo(() => allowedWeightsForProduct(name), [name]);
  
  // Initialize selectedWeights based on allowed weights when product changes
  useEffect(() => {
    const next = (allowedMemo.length > 0)
      ? [allowedMemo[0] as '100g'|'250g'|'500g']
      : ['500g'];
    setSelectedWeights(prev => {
      if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
      return next;
    });
    // Ensure quantities map has defaults for allowed weights
    setQuantities(prev => {
      const updated = { ...prev };
      allowedMemo.forEach(w => { if (!updated[w]) updated[w] = 1; });
      return updated;
    });
  }, [name, allowedMemo]);
  const preferredWeight = (selectedWeights[selectedWeights.length-1] || (allowedMemo[0] as '100g'|'250g'|'500g') || '500g') as ('100g'|'250g'|'500g');
  const displayWeights = useMemo(() => (allowedMemo.length ? allowedMemo : (['500g'] as ('100g'|'250g'|'500g')[])), [allowedMemo]);
  const weightPrices = useMemo(() => {
    const map: { [key: string]: number } = {};
    displayWeights.forEach((w) => {
      map[w] = getProductPrice(name, w as any);
    });
    return map;
  }, [name, displayWeights]);
  const currentPrice = weightPrices[preferredWeight] ?? getProductPrice(name, preferredWeight);
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

  // Image gallery for products with real images
  const galleryImages = useMemo(() => {
    if (!hasImageProduct) return [] as string[];

    // For Vathakkuzhambu Mix, show main pack + preparation + ingredients images
    if (isVathak) {
      // Use the known working 250g JPG as the first image to avoid any webp/weight mismatch
      return [
        '/Images/250/Vathakkuzhambu Mix.jpg',
        '/Images/All/Vatha (1).png',
        '/Images/All/Vatha Ing.png',
      ];
    }

    // For Puliyotharai / Puliodharai Mix
    if (isPuliyo) {
      return [
        '/Images/250/Puliyotharai Mix.jpg',
        '/Images/All/Puli.png',
        '/Images/All/Puli (2).png',
      ];
    }

    // For Poondu Idli Powder
    if (isPoondu) {
      return [
        '/Images/250/Poondu Idli Powder.png',
        '/Images/All/Poondu Idli (1).png',
        '/Images/All/Poondu Idli (2).png',
      ];
    }

    // For Health Mix
    if (isHealth) {
      return [
        '/Images/250/Health Mix.jpg',
        '/Images/All/Health.png',
        '/Images/All/Health 1.png',
        '/Images/All/Health 2.png',
      ];
    }

    // For Turmeric Powder
    if (isTurmeric) {
      return [
        '/Images/250/Turmaric Powder.jpg',
        '/Images/All/Turmeric (1).png',
        '/Images/All/Turmeric (2).png',
      ];
    }

    // For Coffee Powder
    if (isCoffee) {
      return [
        '/Images/500/Coffee powder.jpg',
        '/Images/All/Coffee (1).png',
        '/Images/All/Coffee (2).png',
      ];
    }

    // For Andra/Andhra Spl Paruppu Powder
    if (isAndra) {
      return [
        '/Images/250/Andra Spl Paruppu Powder.jpg',
        '/Images/All/Andhra Spcl.png',
        '/Images/All/Andhara Spcl.png',
      ];
    }

    // Fallback: just show the resolved image
    return [resolvedImage];
  }, [hasImageProduct, isVathak, isPuliyo, isPoondu, isHealth, isTurmeric, isCoffee, isAndra, resolvedImage]);

  const openImageModal = () => {
    if (!galleryImages.length) return;
    setActiveImageIndex(0);
    setIsImageModalOpen(true);
  };

  const showPrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const showNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };
  
  const handleAddToCart = () => {
    const weights = selectedWeights.length ? selectedWeights : ['500g'];
    const invalid = weights.filter(w => (quantities[w] ?? 0) < 1);
    if (invalid.length) {
      alert(`Please order at least 1 for: ${invalid.join(', ')}`);
      return;
    }
    weights.forEach((w) => {
      const qty = Math.max(1, quantities[w] || 1);
      const unitPrice = getProductPrice(name, w as any);
      addToCart({ product_name: `${name} (${w})`, category, price: unitPrice, quantity: qty });
    });
    // After adding, automatically go back to the previous page
    // Prefer history back so the user returns to where they came from
    navigate(-1);
  };

  const handleBuyNow = () => {
    console.log('🚀 ProductDetails handleBuyNow called');
    console.log('📊 TempSamples context state:', { tempSamples, hasTempSamples: hasTempSamples(), count: tempSamples?.length });
    
    // Create current product item
    // Build items for selected weights (support multiple variants)
    const weights = selectedWeights.length ? selectedWeights : ['500g'];
    const invalid = weights.filter(w => (quantities[w] ?? 0) < 1);
    if (invalid.length) {
      alert(`Please order at least 1 for: ${invalid.join(', ')}`);
      return;
    }
    const currentProductItems = weights.map(w => {
      const qty = Math.max(1, quantities[w] || 1);
      const unitPrice = getProductPrice(name, w as any);
      return {
        product_name: `${name} (${w})`,
        quantity: qty,
        price: unitPrice,
        category,
        isSample: false
      };
    });

    // Merge temp samples with current product
    const allItems = hasTempSamples() ? [...tempSamples, ...currentProductItems] : [...currentProductItems];
    console.log('🛒 Merging items for buy now:', { tempSamples, currentProduct: currentProductItems, allItems });
    console.log('🎯 Final merged items count:', allItems.length);

    // Calculate totals (samples are free)
    const productTotal = currentProductItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
          price: productTotal,
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
          <Link to={`/category/${toSlug(category)}`} className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-sm">
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
                  <span className="ml-4 text-white/90 text-lg font-semibold">₹{currentPrice}</span>
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
                            ? 'Turmaric Powder'
                            : isCoffee
                              ? 'Coffee powder'
                              : 'Andra Spl Paruppu Powder';
                  const candidates = [
                    prodName === 'Poondu Idli Powder' ? '/Images/250/Poondu Idli Powder.png' : `/Images/250/${prodName}.jpg`,
                    `/Images/250/${prodName}.jpeg`,
                    `/Images/100/${prodName}.jpg`,
                    `/Images/100/${prodName}.jpeg`,
                    `/Images/500/${prodName}.jpg`,
                    `/Images/1kg/${prodName}.jpg`
                  ];
                  return (
                    <div
                      className={`w-full h-96 ${categoryStyle.bgColor} border ${categoryStyle.borderColor} rounded-xl overflow-hidden p-6 shadow-lg cursor-pointer`}
                      onClick={openImageModal}
                    >
                      <img
                        src={candidates[0]}
                        data-fallback={candidates.slice(1).join(',')}
                        alt={name}
                        className="w-full h-full object-contain object-center p-3 bg-white rounded"
                        onError={(e:any)=>{
                          const el = e.currentTarget as HTMLImageElement;
                          const list = (el.getAttribute('data-fallback')||'').split(',').filter(Boolean);
                          if (list.length) { el.src = list.shift() as string; el.setAttribute('data-fallback', list.join(',')); }
                          else { el.src = '/Images/100/all images.jpg'; }
                        }}
                      />
                    </div>
                  );
                }
                return (
                  <div className={`w-full h-96 ${categoryStyle.bgColor} border ${categoryStyle.borderColor} rounded-xl overflow-hidden p-6 shadow-lg`}>
                    <img
                      src="/Images/100/all images.jpg"
                      alt="Shree Raaga product collection"
                      className="w-full h-full object-contain object-center p-3 bg-white rounded"
                    />
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
              <div className="mt-6 space-y-3">
                <div className="flex gap-2">
                  {(allowedMemo.length ? allowedMemo : (['500g'] as const)).map(w => (
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

                {/* Individual quantity inputs for each selected weight */}
                {selectedWeights.length > 0 && (
                  <div className="space-y-2">
                    {selectedWeights.map((w) => (
                      <div key={w} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-sm font-medium text-gray-700">{w} Quantity:</span>
                        <input
                          type="number"
                          min={0}
                          value={Number.isFinite(quantities[w]) ? quantities[w] : 0}
                          onChange={(e)=>{
                            const raw = e.target.value;
                            const num = raw === '' ? 0 : parseInt(raw, 10);
                            setQuantities(prev=>({ ...prev, [w]: isNaN(num) ? 0 : Math.max(0, num) }));
                          }}
                          className="w-16 border rounded px-2 py-1 text-center"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {hasImageProduct ? (
                  <>
                    <button 
                      onClick={handleBuyNow}
                      className="bg-gradient-to-r from-red-600 to-red-500 text-white font-medium py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Buy Now{hasTempSamples() ? ' + Samples' : ''}</span>
                    </button>

                    <button 
                      onClick={handleAddToCart}
                      className={`font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                        isInCart(name)
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      {isInCart(name) ? (
                        <>
                          <Check className="h-5 w-5" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="col-span-2 flex items-center justify-center bg-gray-100 text-gray-600 font-semibold rounded-lg">Coming soon</div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className={`${categoryStyle.bgColor} ${categoryStyle.borderColor} border rounded-xl p-6`}>
                <p className="text-gray-700 leading-relaxed">{richDescription}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="text-gray-500 w-24 flex-shrink-0">Category:</span>
                      <span className="text-gray-800 font-medium">{category}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 w-24 flex-shrink-0 mt-0.5">Price:</span>
                      {hasImageProduct ? (
                        <div className="space-y-1">
                          {displayWeights.map((w) => (
                            <div
                              key={w}
                              className={selectedWeights.includes(w)
                                ? 'text-gray-900 font-semibold'
                                : 'text-gray-700'}
                            >
                              {w}: ₹{weightPrices[w] ?? getProductPrice(name, w as any)}
                            </div>
                          ))}
                        </div>
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
      
      {/* Image gallery modal */}
      {isImageModalOpen && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center justify-between">
              <button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={showPrevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <img
                src={galleryImages[activeImageIndex]}
                alt={name}
                className="max-h-[80vh] max-w-full object-contain bg-white rounded-xl shadow-2xl"
              />

              <button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={showNextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}

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