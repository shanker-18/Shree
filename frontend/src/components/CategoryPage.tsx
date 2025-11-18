import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Plus, Check, X, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthModal from './AuthModal';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTempSamples } from '../contexts/TempSamplesContext';
import { categories } from '../data/categories';
import { toSlug, parseCategorySlug } from '../utils/slugUtils';
import { isProductAvailable, allowedWeightsForProduct, weightToFolder, getProductPrice } from '../data/availability';
import { getShortDescription } from '../data/shortDescriptions';
import { getImageOverride } from '../data/imageOverrides';

// Legacy categories kept for reference only
const legacyCategories = [
  {
    title: "Powders",
    description: "Traditional cooking powders made fresh without additives.",
    gradient: "from-red-600 to-rose-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    items: [
      "Turmeric Powder: Prepared from cleaned and dried 'virali' turmeric tubes, ground finely without additives. Used for cooking and as a cosmetic facial application. It's an effective germicide and adds flavor.",
      "Idly Powder: Prepared in two ways: one with Gingelly oil and garlic, another with 'JAI NATTU-CHEKKU' Gingelly oil and garlic. Eaten as a side dish with Idly or Dosa.",
      "Milagu (Pepper) Powder: Used as an ingredient for cooking Rasam and Ven Pongal, adding flavor and taste.",
      "Rasam Powder: Prepared with tomato in dhal stew. Used in rasam to make it aromatic and tasty.",
      "Jeera Powder: Can be used as an ingredient in any type of cooking.",
      "Vathal Powder: Made from a fine variety of chili. Used for making pickles and savory preparations.",
      "Malli (Coriander) Powder: Prepared from clean and plain coriander seeds. Can be mixed with any type of cooking.",
      "Pulikuzhambu Powder: Blended with vegetables to make 'pulikuzhambu'.",
    ],
  },
  {
    title: "Mixes",
    description: "Ready-to-cook mixes crafted for authentic taste.",
    gradient: "from-amber-600 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    items: [
      "Puliyotharai (Tamarind) Mix: A chemical-free mix used to prepare tamarind rice. 100 grams are sufficient for a quarter-measure of rice.",
      "Vathakkuzhambu (Dried veg. Gravy): A tasty and appetizing gravy. It's a unique combination with 'JAI Blackgram Appalam'.",
      "Vathakkuzhambu Mix: Contains sundakkai vathal, manathakkali vathal, and garlic. Mixing 2 tablespoons with Gingelly oil and rice makes a tasty dish.",
    ],
  },
  {
    title: "Vathal",
    description: "Sun-dried traditional vathals ready to fry and relish.",
    gradient: "from-blue-600 to-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-800",
    items: [
      "Seeni Avarai (Cluster Beans) Vathal: Can be fried in oil or ghee and eaten with various rice dishes.",
      "Sundakkai Vathal: Fried in oil or ghee, eaten with Kuzhambu rice, Curd rice, etc. Used in Vathal Kuzhambu to remove stomach worms and control ulcers.",
      "Manathakkali Vathal: Also called tiny-tomato or short-tomato. Tastes good when fried in coconut oil. Can be mixed with rice or sprinkled with ghee.",
      "Mithukku Vathal: Prepared from 'KOVAIKKAI'. Can be fried in ghee and eaten with rice.",
      "Koozh Vathal",
      "Vendaikkai (Bhendi) Vathal: Prepared from Bhendi, fried in ghee, and eaten with rice.",
      "Pagalkkai (Bitter Gourd) Vathal: Can be fried in oil and eaten with different rice varieties.",
      "Morr Milagai (Dried Chilli) Vathal: Prepared by immersing dried green chili in buttermilk. Fried in cooking oil, it's a side dish for 'Pazhaiya Sadam' and 'Koozhu'.",
      "Dried Brinjal (Kathirikai) Vathal: Fried in oil and eaten with different rice varieties.",
      "Onion Vathal: When fried with greens preparation, it adds taste and aroma.",
      "Pirandai Vathal: Good for digestion.",
      "Onion Vadagam: Prepared with gram and onion paste and dried in sunlight. Can be fried in gingelly or groundnut oil and eaten as a side dish or standalone.",
    ],
  },
  {
    title: "Appalam",
    description: "Crispy appalams made from quality ingredients.",
    gradient: "from-emerald-600 to-green-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
    items: [
      "Pai Appalam: Prepared from pure black-gram powder. Fried and eaten as a side dish for Puttu, Sambar Rice, Rasam Rice. Can also be a snack for children.",
      "Kizangu Appalam: Made from Tapioca powder mixed with masala and dried on a flatbed. Can be eaten as is or with rice.",
      "Sovi Appalam: Fried and eaten with food or as a snack for children.",
      "Ulundhu (Blackgram) Appalam: Prepared from quality blackgram powder. It's very tasty and healthy.",
      "Arisi Appalam: Fried in cooking oil. Eaten as a side dish for Sambar Rice, Rasam Rice, Puli Kuzhambu rice, Vathal rice, and puliyotharai rice.",
      "Garlic Appalam: Prepared by blending garlic in the dough.",
      "Ilai Vadaam: Can be eaten with Sambar and Rasam Rice.",
    ],
  },
  {
    title: "Pickles",
    description: "Homemade pickles with medicinal benefits and rich taste.",
    gradient: "from-purple-600 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
    items: [
      "Salted Lemon: Oil-free pickle preserved in salt. Aids digestion and can be eaten with Kuzhambu Rice, Curd Rice, etc.",
      "Lemon Pickle: A common pickle that can be eaten with any dish.",
      "Avakkai Pickle: Mango pickle prepared in Andhra style.",
      "Kidarangakai Pickle: Very tasty and improves digestive system function.",
      "Inji (Ginger) Pickle: Has a tickling taste and is healthy.",
      "Mavadu Pickle: A good combination as a side dish for buttermilk or curd rice and 'Koozh'.",
      "Kovaikkai Pickle: Good for the digestive system and helps control diabetes.",
      "Mudakatthan Pickle: Good for joint pain.",
      "Banana Stem Pickle: Helps segregate residuals from the body and is good for kidney function.",
      "Kongura Pickle: A special pickle from Andhra state that removes constipation.",
      "Garlic Pickle: Has medicinal value for an ailing heart and removes gastritis.",
      "Jadhikkai Pickle: Aids the digestive function.",
      "Tamarind Green Chilly Pickle: Eaten as a side dish for idli, dosa, and curd rice.",
    ],
  },
  {
    title: "Oils",
    description: "Pure chekku (cold-pressed) oils for cooking and wellness.",
    gradient: "from-yellow-600 to-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    items: [
      "Cekku (Chaki) Groundnut Oil: Extracted from groundnuts using a country oil extractor (Cekku). Full of aroma and is healthy.",
      "Cekku (Chaki) Coconut Oil: Contains 'Monolarin', which is found in mother's milk. It's chemical-free and can be used for any cooking.",
      "Cekku (Chaki) Gingelly Oil: Extracted from quality Gingelly by adding country jaggery. Used for both cooking and bathing.",
    ],
  },
];

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; category: string; price: number; description?: string } | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalProduct, setModalProduct] = useState<{ name: string; category: string; price: number; description?: string; image?: string | null } | null>(null);
const [modalWeights, setModalWeights] = useState<('100g'|'250g'|'500g'|'1kg')[]>(['500g']);
const [modalQuantities, setModalQuantities] = useState<{[key: string]: number}>({ '250g': 1, '100g': 1, '500g': 1, '1kg': 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [weightFilter, setWeightFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const { tempSamples, hasTempSamples } = useTempSamples();
  
  // Force correct pricing on production domain
  const isProduction = useMemo(() => {
    return window.location.hostname === 'www.shreeraagaswaadghar.com' || 
           window.location.hostname === 'shreeraagaswaadghar.com' ||
           window.location.hostname.includes('vercel.app');
  }, []);
  
  // Check if user has discount eligibility from free samples (disabled on production)
  const hasDiscountEligibility = useMemo(() => {
    // On production, force disable discount eligibility
    if (isProduction) {
      return false;
    }
    // On localhost/dev, allow normal logic
    return localStorage.getItem('hasDiscountEligibility') === 'true' && 
           localStorage.getItem('freeSamplesClaimed') === 'true' &&
           user;
  }, [isProduction, user]);
  
  // Clear problematic flags on production
  useEffect(() => {
    if (isProduction) {
      localStorage.removeItem('hasDiscountEligibility');
      localStorage.removeItem('freeSamplesClaimed');
      console.log('🧹 CategoryPage Production: Cleared discount flags');
    }
  }, [isProduction]);
  
  // Check if user has claimed first order discount (50% off)
  const hasClaimedFirstOrderDiscount = localStorage.getItem('firstOrderDiscountClaimed') === 'true';
  
  // Check if user has completed their first order
  const hasCompletedFirstOrder = user?.id ? localStorage.getItem(`firstOrderCompleted_${user.id}`) === 'true' : false;
  
  // Parse the category slug and find matching category
  const decodedSlug = slug ? parseCategorySlug(slug) : '';
  const category = categories.find((c) => toSlug(c.title) === decodedSlug);

  // Comprehensive image mapping - Updated to use ALL available images
  const productImageMap: { pattern: RegExp; src: string; category?: string }[] = [
    // Powder category - exact matches with available images
    { pattern: /^turmeric.*powder|manjal.*powder/i, src: '/Items/Turmeric Powder.jpeg', category: 'Powder' },
    { pattern: /^sambar.*powder/i, src: '/Items/Sambar powder.jpeg', category: 'Powder' },
    { pattern: /^rasam.*powder/i, src: '/Items/Rasam Powder.jpeg', category: 'Powder' },
    { pattern: /^idli.*powder|^idly.*powder/i, src: '/Items/Idli Powder.jpeg', category: 'Powder' },
    { pattern: /^poondu.*idli.*powder|^poondu.*idly.*powder/i, src: '/Images/250/Poondu Idli Powder.png', category: 'Powder' },
    { pattern: /^andra.*spl.*paruppu.*powder|andhra.*spcl.*powder/i, src: '/Items/andhra spcl.jpg', category: 'Powder' },
    { pattern: /^moringa.*leaf.*powder/i, src: '/Items/moringa leaf powder.jpg', category: 'Powder' },
    { pattern: /^curry.*leaves.*powder|curry.*leaf.*powder/i, src: '/Items/curry leaf powder.jpg', category: 'Powder' },
    { pattern: /^milagu.*powder|pepper.*powder/i, src: '/Items/Rasam Powder.jpeg', category: 'Powder' },
    { pattern: /^jeera.*powder|cumin.*powder/i, src: '/Items/Turmeric Powder.jpeg', category: 'Powder' },
    { pattern: /^vathal.*powder/i, src: '/Items/Sambar powder.jpeg', category: 'Powder' },
    { pattern: /^malli.*powder|coriander.*powder/i, src: '/Items/Idli Powder.jpeg', category: 'Powder' },
    
    // Mix & Pickle category - exact matches with available images
    { pattern: /^puliodharai.*mix|^puliyotharai.*mix|tamarind.*mix/i, src: '/Items/Puliyotharai Mix.jpeg', category: 'Mix & Pickle' },
    { pattern: /^vathakkuzhambu.*mix|vathal.*kuzhambu.*mix/i, src: '/Items/Vathakkuzhambu Mix.jpeg', category: 'Mix & Pickle' },
    { pattern: /pulikuzhambu.*powder/i, src: '/Items/Puliyokuzhambu Powder.jpg', category: 'Powder' },
    { pattern: /^pulikuzhambu.*powder/i, src: '/Items/Puliyokuzhambu Powder.jpg', category: 'Mix & Pickle' },
    { pattern: /^poondu.*pickle|^garlic.*pickle/i, src: '/Items/Poondu pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^pirandai.*pickle/i, src: '/Items/Pirandai pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^jathikkai.*pickle|^jadhikkai.*pickle/i, src: '/Items/Jadhikkai Pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^mudakatthan.*pickle|^mudakkathan.*pickle/i, src: '/Items/Mudakatthan Pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^kara.*narthangai.*pickle/i, src: '/Items/Kara narthangai pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^salted.*lemon|lemon.*pickle/i, src: '/Items/Kara narthangai pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^avakkai.*pickle/i, src: '/Items/Mudakatthan Pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^kidarangakai.*pickle/i, src: '/Items/Pirandai pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^inji.*pickle|ginger.*pickle/i, src: '/Items/Garlic Pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^mavadu.*pickle/i, src: '/Items/Kara narthangai pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^kovaikkai.*pickle/i, src: '/Items/Pirandai pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^banana.*stem.*pickle/i, src: '/Items/Mudakatthan Pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^kongura.*pickle/i, src: '/Items/Garlic Pickle.jpeg', category: 'Mix & Pickle' },
    { pattern: /^tamarind.*green.*chilly.*pickle/i, src: '/Items/Kara narthangai pickle.jpeg', category: 'Mix & Pickle' },
    
    
    // Vathal category - distributed among available images
    { pattern: /^seeni.*avarai.*vathal/i, src: '/Items/Vathakkuzhambu Mix.jpeg', category: 'Vathal' },
    { pattern: /^sundakkai.*vathal/i, src: '/Items/Mudakatthan Pickle.jpeg', category: 'Vathal' },
    { pattern: /^manathakkali.*vathal/i, src: '/Items/Pirandai pickle.jpeg', category: 'Vathal' },
    { pattern: /^mithukku.*vathal/i, src: '/Items/Garlic Pickle.jpeg', category: 'Vathal' },
    { pattern: /^koozh.*vathal/i, src: '/Items/Puliyotharai Mix.jpeg', category: 'Vathal' },
    { pattern: /^vendaikkai.*vathal|bhendi.*vathal/i, src: '/Items/Kara narthangai pickle.jpeg', category: 'Vathal' },
    { pattern: /^pagalkkai.*vathal|bitter.*gourd.*vathal/i, src: '/Items/Jadhikkai Pickle.jpeg', category: 'Vathal' },
    { pattern: /^morr.*milagai.*vathal|dried.*chilli.*vathal/i, src: '/Items/Poondu pickle.jpeg', category: 'Vathal' },
    { pattern: /^dried.*brinjal.*vathal|kathirikai.*vathal/i, src: '/Items/Turmeric Powder.jpeg', category: 'Vathal' },
    { pattern: /^onion.*vathal/i, src: '/Items/Idli Powder.jpeg', category: 'Vathal' },
    { pattern: /^pirandai.*vathal/i, src: '/Items/Pirandai pickle.jpeg', category: 'Vathal' },
    { pattern: /^onion.*vadagam/i, src: '/Items/Sambar powder.jpeg', category: 'Vathal' },
    
    // Oils category - distributed among available images
    { pattern: /^cekku.*groundnut.*oil|chaki.*groundnut.*oil/i, src: '/Items/Puliyokuzhambu Powder.jpg', category: 'Oils' },
    { pattern: /^cekku.*coconut.*oil|chaki.*coconut.*oil/i, src: '/Items/Rasam Powder.jpeg', category: 'Oils' },
    { pattern: /^cekku.*gingelly.*oil|chaki.*gingelly.*oil/i, src: '/Items/Vathakkuzhambu Mix.jpeg', category: 'Oils' },
    
    // Coffee category
    { pattern: /^coffee.*powder/i, src: '/Items/coffee powder.jpg', category: 'Coffee' },
    { pattern: /^coffee.*large/i, src: '/Items/Coffee large.jpg', category: 'Coffee' }
  ];

  // Function to get image for any product across all categories - Updated to use new folder structure
  const getProductImage = (item: string, categoryTitle: string): string | null => {
    const cleanProductName = item.includes(':') ? item.split(':')[0].trim() : item;

    // 0) Per-product override
    const override = getImageOverride(cleanProductName);
    if (override) return override;

    // 1) Try explicit mapping first (these files exist under /Items)
    const lower = cleanProductName.toLowerCase();
    const mapped = productImageMap.find((m) => !m.category || m.category === categoryTitle ? m.pattern.test(lower) : false);
    if (mapped) return mapped.src;

    // 2) Otherwise, point to the new folder structure (frontend will handle fallbacks)
    const folders = ['100', '500', '1kg'];
    const first = folders[0];
    const imagePath = `/Images/${first}/${cleanProductName}`;
    return `${imagePath}.webp`;
  };

  const handleBuyNow = (productName: string) => {
    console.log('🚀 CategoryPage handleBuyNow called for:', productName);
    console.log('📊 TempSamples context state:', { tempSamples, hasTempSamples: hasTempSamples(), count: tempSamples?.length });
    
    // Ongoing offer is applied at cart total (15% off on ₹500+), keep per-item price intact
    const price = getProductPrice(productName);
    // Find the full item string for better description
    const fullItem = category?.items.find(item => getItemTitle(item) === productName) || productName;
    const product = { name: productName, category: category!.title, price, description: getProductDescription(fullItem) };
    setSelectedProduct(product);
    
    // Create current product item
    const currentProductItem = {
      product_name: product.name,
      quantity: 1,
      price: product.price,
      category: product.category,
      isSample: false
    };

    // Only include the current product item (no automatic samples)
    const allItems = [currentProductItem];
    console.log('🛒 CategoryPage product item:', { currentProduct: currentProductItem, allItems });
    console.log('🎯 Final items count:', allItems.length);

    // Calculate totals
    const productTotal = product.price;
    let discountAmount = 0;
    let finalAmount = productTotal;

    // Note: Free samples discount logic removed - only add samples if user explicitly selects them
    
    // Store merged product data for guest checkout
    localStorage.setItem('pendingProduct', JSON.stringify({ ...product, items: allItems, total_amount: productTotal, discount_amount: discountAmount, final_amount: finalAmount }));
    
    // Check if user is already authenticated
    if (user) {
      // User is logged in, go directly to order details
      navigate('/order-details', { 
        state: { 
          isAuthenticated: true, 
          productName: product.name, 
          category: product.category, 
          price: product.price,
          items: allItems,
          total_amount: productTotal,
          discount_amount: discountAmount,
          final_amount: finalAmount,
          isFromBuyNow: true
        } 
      });
    } else {
      // User is not logged in, show auth modal
      setShowAuthModal(true);
    }
  };
  
  const getProductDescription = (productName: string): string => {
    // Find the full item description from the category items
    const fullItem = category?.items.find(item => {
      // Handle items that already have descriptions
      if (item.includes(':')) {
        return item.split(':')[0].trim() === productName;
      }
      // Handle special case for Koozh Vathal
      if (productName === "Koozh Vathal") {
        return item === "Koozh Vathal";
      }
      return item === productName;
    });
    
    if (fullItem) {
      if (fullItem.includes(':')) {
        return `${productName}: ${fullItem.split(':')[1].trim()}`;
      } else if (productName === "Koozh Vathal") {
        return "Koozh Vathal - Prepared from wet-ground boiled rice with salt and spices.";
      }
    }
    
    return `${productName} - A quality product from our ${category?.title} collection.`;
  };
  
  // Extract just the title part (before the colon) from a full item string
  const getItemTitle = (item: string): string => {
    return item.includes(':') ? item.split(':')[0].trim() : item;
  };
  
  const handleProductClick = (productName: string) => {
    // Use base price per product (e.g., 250g price for powders)
    const price = getProductPrice(productName);
    
    // Find the full item string from the category items for better description and image matching
    const fullItem = category?.items.find(item => getItemTitle(item) === productName) || productName;
    const imgSrc = getProductImage(productName, category!.title);
    
    navigate('/product-details', {
      state: {
        product: {
          name: productName,
          category: category!.title,
          price,
          description: getProductDescription(productName),
          image: imgSrc
        }
      }
    });
  };

  const handleAddToCart = (productName: string) => {
    // Use first order discount (50% off) if claimed and not completed, otherwise regular base price
    const price = getProductPrice(productName);
    
    // Ongoing offer is applied at cart total (15% off on ₹500+), keep per-item price intact
    
    addToCart({ product_name: productName, category: category!.title, price, quantity: 1 });
  };

  const handleQuickView = (productName: string) => {
    const price = getProductPrice(productName);
    
    // Ongoing offer is applied at cart total (15% off on ₹500+), keep per-item price intact
    
    const fullItem = category?.items.find(item => getItemTitle(item) === productName) || productName;
    const imgSrc = getProductImage(productName, category!.title);
    
    setModalProduct({
      name: productName,
      category: category!.title,
      price,
      description: getProductDescription(fullItem),
      image: imgSrc
    });
    const allowed = allowedWeightsForProduct(productName);
    // Force specific weights per product
    const lower = productName.toLowerCase();
    const isPuliyo = lower.includes('puliyotharai') || lower.includes('puliodharai');
    const isVathak = lower.includes('vathakkuzhambu') || lower.includes('vathakulambu');
    const isTurmeric = (lower.includes('turmeric') || lower.includes('manjal')) && lower.includes('powder');
    const isPoondu = (lower.includes('poondu') || lower.includes('poondhu')) && (lower.includes('idli') || lower.includes('idly'));
    const isAndra = (lower.includes('andra') || lower.includes('andhra')) && (lower.includes('spl') || lower.includes('special')) && lower.includes('paruppu') && lower.includes('powder');
    const isHealth = lower.includes('health mix') || lower.includes('healthmix');
    const isCoffee = lower.includes('coffee') && lower.includes('powder');

    if (isPuliyo || isVathak || isTurmeric || isPoondu || isAndra) {
      setModalWeights(['250g']);
    } else if (isHealth) {
      // Health Mix: allow only 250g
      setModalWeights(['250g']);
    } else if (isCoffee) {
      // Coffee powder: allow only 500g
      setModalWeights(['500g']);
    } else {
      setModalWeights(allowed.length ? [allowed[0]] : ['500g']);
    }
    setModalQuantities({ '100g': 1, '250g': 1, '500g': 1 });
    setShowProductModal(true);
  };

  const handleModalBuyNow = () => {
    if (modalProduct) {
      setShowProductModal(false);
      // Build items per selected weights with individual quantities
      const weights = modalWeights.length ? modalWeights : ['500g'];
      const currentItems = weights.map(w => {
        const qty = modalQuantities[w] || 1;
        const unitPrice = getProductPrice(modalProduct.name, w as any);
        return {
          product_name: `${modalProduct.name} (${w})`,
          quantity: qty,
          price: unitPrice,
          category: modalProduct.category,
          isSample: false
        };
      });
      const allItems = [...currentItems]; // Only include the current product items (no automatic samples)
      const productTotal = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let discountAmount = 0;
      let finalAmount = productTotal;
      // Note: Free samples discount logic removed - only add samples if user explicitly selects them
      localStorage.setItem('pendingProduct', JSON.stringify({ 
        name: `${modalProduct.name}${weights.length>1?'' : ` (${weights[weights.length-1]})`}`,
        category: modalProduct.category,
        price: productTotal,
        items: allItems,
        total_amount: productTotal,
        discount_amount: discountAmount,
        final_amount: finalAmount
      }));
      // Navigate respecting auth
      if (user) {
        navigate('/order-details', {
          state: {
            isAuthenticated: true,
            productName: `${modalProduct.name}${weights.length>1?'' : ` (${weights[weights.length-1]})`}`,
            category: modalProduct.category,
            price: productTotal,
            items: allItems,
            total_amount: productTotal,
            discount_amount: discountAmount,
            final_amount: finalAmount,
            isFromBuyNow: true
          }
        });
      } else {
        setShowAuthModal(true);
      }
    }
  };

  const handleModalAddToCart = () => {
    if (modalProduct) {
      const weights = modalWeights.length ? modalWeights : ['500g'];
      weights.forEach(w => {
        const qty = modalQuantities[w] || 1;
        const unitPrice = getProductPrice(modalProduct.name, w as any);
        addToCart({ product_name: `${modalProduct.name} (${w})`, category: modalProduct.category, price: unitPrice, quantity: qty });
      });
      // Close the quick view modal after adding (returning to the category grid view)
      setShowProductModal(false);
    }
  };

  const handleSignIn = () => { setShowAuthModal(false); navigate('/login'); };
  const handleGuest = () => {
    setShowAuthModal(false);
    
    // Get merged product data from localStorage
    const pendingProduct = JSON.parse(localStorage.getItem('pendingProduct') || '{}');
    
    if (selectedProduct) {
      navigate('/order-details', { 
        state: { 
          isAuthenticated: false, 
          productName: selectedProduct.name, 
          category: selectedProduct.category, 
          price: selectedProduct.price,
          items: pendingProduct.items || [{
            product_name: selectedProduct.name,
            quantity: 1,
            price: selectedProduct.price,
            category: selectedProduct.category
          }],
          total_amount: pendingProduct.total_amount || selectedProduct.price,
          discount_amount: pendingProduct.discount_amount || 0,
          final_amount: pendingProduct.final_amount || selectedProduct.price,
          isFromBuyNow: true
        } 
      });
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist or has been moved.</p>
          <Link to="/">
            <button className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-300">Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  const isPowderCategory = /podi|powder/i.test(category.title);

  // Filter and search products
  const filteredItems = useMemo(() => {
    if (!category) return [];
    
    return category.items.filter(item => {
      const itemTitle = getItemTitle(item);
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch = !normalizedQuery || itemTitle.toLowerCase().includes(normalizedQuery);
      
      // For now, weight filter is just for show - all products are 200g
      const matchesWeight = !weightFilter || weightFilter === '200g';
      
      return matchesSearch && matchesWeight;
    });
  }, [category, searchQuery, weightFilter]);

  // Available weight options
  const weightOptions = [
    { value: '', label: 'All Weights' },
    { value: '50g', label: '50g' },
    { value: '100g', label: '100g' },
    { value: '200g', label: '200g' },
    { value: '500g', label: '500g' },
    { value: '1kg', label: '1kg' }
  ];

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/25 to-blue-300/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/#categories" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-sm">
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Back to Categories</span>
          </Link>
        </div>
        
        <div className={`rounded-2xl overflow-hidden mb-6 bg-gradient-to-r ${category.gradient} p-4 sm:p-6 md:p-10 relative shadow-xl`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/50 rounded-full"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-sm">{category.title}</h1>
            <p className="text-white/95 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">{category.description}</p>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${category.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
              />
            </div>
            
            {/* Filter Button */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border transition-all duration-200 ${
                  showFilters || weightFilter
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                {weightFilter && (
                  <span className="ml-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    {weightFilter}
                  </span>
                )}
              </button>
              
              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Weight Options</h4>
                    <div className="space-y-2">
                      {weightOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="weight"
                            value={option.value}
                            checked={weightFilter === option.value}
                            onChange={(e) => setWeightFilter(e.target.value)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    
                    {weightFilter && (
                      <button
                        onClick={() => setWeightFilter('')}
                        className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Search Results Count */}
          {searchQuery && (
            <div className="mt-4 text-sm text-gray-600">
              Found {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </div>
          )}
        </div>
        
        {/* Modern E-commerce Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No products found' : 'No products available'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery 
                  ? `No products match your search "${searchQuery}". Try adjusting your search terms.`
                  : 'There are no products available in this category at the moment.'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredItems.map((item, index) => {
            const itemLower = item.toLowerCase();
            const fastMovingList = ['puliodharai mix','vathakkuzhambu mix','poondu pickle','pirandai pickle','jathikkai pickle','mudakkathan pickle','kara narthangai pickle','turmeric powder','sambar powder','rasam powder','ellu idli powder','poondu idli powder','andra spl paruppu powder','moringa leaf powder','curry leaves powder','red chilli powder','ulundhu appalam','rice appalam','kizhangu appalam'];
            const isFast = fastMovingList.some((x) => itemLower.includes(x));
            
            // Get just the title part for display
            const itemTitle = getItemTitle(item);
            
            // Get image based on the item title for better matching
            const imgSrc = getProductImage(itemTitle, category.title);

            return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1 relative group cursor-pointer"
              onClick={() => handleProductClick(itemTitle)}
            >
                {/* Dynamic Discount Badge */}
                <div className="absolute top-3 right-3 z-20">
                  {!isProductAvailable(itemTitle) && (
                    <span className="bg-gray-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      SOON
                    </span>
                  )}
                </div>
                
                {/* Vegetarian Icon */}
                <div className="absolute top-3 left-3 z-20">
                  <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                
                {/* Show image only for Vathakkuzhambu Mix; others keep a clean placeholder */}
                {(() => {
                  const lower = itemTitle.toLowerCase();
                  const isVathak = lower.includes('vathakkuzhambu') || lower.includes('vathakulambu');
                  const isPuliyo = lower.includes('puliyotharai') || lower.includes('puliodharai');
                  const isPoondu = (lower.includes('poondu') || lower.includes('poondhu')) && (lower.includes('idli') || lower.includes('idly'));
                  const isAndra = (lower.includes('andra') || lower.includes('andhra')) && (lower.includes('spl') || lower.includes('special')) && lower.includes('paruppu') && lower.includes('powder');
                  const isHealth = lower.includes('health mix') || lower.includes('healthmix');
                  const isTurmeric = (lower.includes('turmeric') || lower.includes('manjal')) && lower.includes('powder');
                  const isCoffee = lower.includes('coffee') && lower.includes('powder');
                  if (isVathak || isPuliyo || isPoondu || isAndra || isHealth || isTurmeric || isCoffee) {
                  const name = isVathak
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
                    let candidates = [
                      name === 'Poondu Idli Powder' ? '/Images/250/Poondu Idli Powder.png' : `/Images/250/${name}.jpg`,
                      `/Images/250/${name}.jpeg`,
                      `/Images/100/${name}.jpg`,
                      `/Images/100/${name}.jpeg`,
                      `/Images/500/${name}.jpg`,
                      `/Images/1kg/${name}.jpg`
                    ];
                    if (isHealth) {
                      candidates = [
                        `/Images/250/Health Mix.jpg`,
                        `/Images/250/Health Mix.jpeg`,
                        `/Items/Health Mix.jpeg`,
                        `/Items/Health Mix.jpg`,
                        `/Images/1kg/Healthy Mix.jpg`,
                        `/Images/1kg/Healthy Mix.jpeg`
                      ];
                    }
                    return (
                      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden rounded-2xl bg-white">
                        <img
                          src={candidates[0]}
                          data-fallback={candidates.slice(1).join(',')}
                          alt={itemTitle}
                          className="w-full h-full object-contain object-center p-2 bg-white"
                          onError={(e:any)=>{
                            const el = (e.currentTarget as HTMLImageElement);
                            const list = (el.getAttribute('data-fallback')||'').split(',').filter(Boolean);
                            if (list.length) { el.src = list.shift() as string; el.setAttribute('data-fallback', list.join(',')); } else { el.style.display='none'; }
                          }}
                        />
                      </div>
                    );
                  }
                  return (
                    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full bg-gray-800 text-white text-xs font-semibold shadow">Coming soon</span>
                      </div>
                    </div>
                  );
                })()}
                
                {/* Product Details */}
                <div className="p-3 sm:p-4 md:p-5">
                  <h3 className="text-gray-800 font-bold text-sm sm:text-base md:text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors duration-300" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.5rem'
                  }}>
                    {itemTitle}
                  </h3>
                  
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{getShortDescription(itemTitle) || 'Ready-to-cook authentic traditional mix'}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isProductAvailable(itemTitle) ? (() => {
                        const basePrice = getProductPrice(itemTitle);
                        const firstOrderPrice = Math.round(basePrice / 2);
                        const discountPrice = Math.round(basePrice * 0.9); // 10% off
                        if (hasClaimedFirstOrderDiscount && !hasCompletedFirstOrder && user) {
                          return (
                            <>
                              <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">₹{firstOrderPrice}</span>
                              <span className="text-sm sm:text-base md:text-lg text-gray-500 line-through">₹{basePrice}</span>
                              <span className="text-xs text-red-500 font-bold">FIRST ORDER</span>
                            </>
                          );
                        }
                        if (hasDiscountEligibility) {
                          return (
                            <>
                              <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">₹{discountPrice}</span>
                              <span className="text-sm sm:text-base md:text-lg text-gray-500 line-through">₹{basePrice}</span>
                            </>
                          );
                        }
                        return (
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">₹{basePrice}</span>
                        );
                      })() : (
                        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-500">Coming soon</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSignIn={handleSignIn} onGuest={handleGuest} />
      
      {/* Product Details Modal */}
      {showProductModal && modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-sm sm:max-w-lg md:max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Product Details</h2>
              <button 
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 flex items-center justify-center h-60 sm:h-80">
                  {modalProduct.image ? (
                    (() => {
const sel = (modalWeights[modalWeights.length-1] || '500g') as ('100g'|'250g'|'500g'|'1kg');
                      const folder = weightToFolder(sel);
                      const title = modalProduct.name;
                      const titleLower = title.toLowerCase();
                      const words = title.split(' ');
                      const titleFirstUpperRestLower = words
                        .map((w, i) => i === 0 ? (w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : w.toLowerCase())
                        .join(' ');
                      const nameVariants = Array.from(new Set([title, titleFirstUpperRestLower, titleLower]));
                      const exts = ['webp','png','jpg','jpeg'];

                      // For Puliyotharai Mix, force exact 250g image path
                      let primary = `/Images/${folder}/${title}.webp`;
                      const fallbackList: string[] = [];
                      if (titleLower.includes('puliyotharai') || titleLower.includes('puliodharai')) {
                        primary = `/Images/250/Puliyotharai Mix.jpg`;
                        const forced = [
                          `/Images/250/Puliyotharai Mix.jpeg`,
                          `/Images/100/Puliyotharai Mix.jpg`,
                          `/Images/100/Puliyotharai Mix.jpeg`,
                          `/Images/500/Puliyotharai Mix.jpg`,
                          `/Images/1kg/Puliyotharai Mix.jpg`
                        ];
                        fallbackList.push(...forced);
                      } else if (titleLower.includes('vathakkuzhambu') || titleLower.includes('vathakulambu')) {
                        primary = `/Images/250/Vathakkuzhambu Mix.jpg`;
                        const forced = [
                          `/Images/250/Vathakkuzhambu Mix.jpeg`,
                          `/Images/100/Vathakkuzhambu Mix.jpg`,
                          `/Images/100/Vathakkuzhambu Mix.jpeg`,
                          `/Images/500/Vathakkuzhambu Mix.jpg`,
                          `/Images/1kg/Vathakkuzhambu Mix.jpg`
                        ];
                        fallbackList.push(...forced);
                      } else if ((titleLower.includes('poondu') || titleLower.includes('poondhu')) && (titleLower.includes('idli') || titleLower.includes('idly'))) {
                        primary = `/Images/250/Poondu Idli Powder.jpg`;
                        const forced = [
                          `/Images/250/Poondu Idli Powder.jpeg`,
                          `/Images/100/Poondu Idli Powder.jpg`,
                          `/Images/100/Poondu Idli Powder.jpeg`,
                          `/Images/500/Poondu Idli Powder.jpg`,
                          `/Images/1kg/Poondu Idli Powder.jpg`
                        ];
                        fallbackList.push(...forced);
                      } else if ((titleLower.includes('andra') || titleLower.includes('andhra')) && (titleLower.includes('spl') || titleLower.includes('special')) && titleLower.includes('paruppu') && titleLower.includes('powder')) {
                        primary = `/Images/250/Andra Spl Paruppu Powder.jpg`;
                        const forced = [
                          `/Images/250/Andra Spl Paruppu Powder.jpeg`,
                          `/Images/100/Andra Spl Paruppu Powder.jpg`,
                          `/Images/100/Andra Spl Paruppu Powder.jpeg`,
                          `/Images/500/Andra Spl Paruppu Powder.jpg`,
                          `/Images/1kg/Andra Spl Paruppu Powder.jpg`
                        ];
                        fallbackList.push(...forced);
                      } else if (titleLower.includes('health mix') || titleLower.includes('healthmix')) {
                        // Health Mix: 250g uses 'Health Mix.jpg', 1kg uses 'Healthy Mix.jpg'
                        const current = (modalWeights[modalWeights.length-1] || '').toLowerCase();
                        if (current.includes('1kg')) {
                          primary = `/Images/1kg/Healthy Mix.jpg`;
                      const forced = [
                            `/Images/1kg/Healthy Mix.jpeg`,
                            `/Images/250/Health Mix.jpg`,
                            `/Images/250/Health Mix.jpeg`,
                            `/Items/Health Mix.jpeg`,
                            `/Items/Health Mix.jpg`
                          ];
                          fallbackList.push(...forced);
                        } else {
                          primary = `/Images/250/Health Mix.jpg`;
                          const forced = [
                            `/Images/250/Health Mix.jpeg`,
                            `/Images/1kg/Healthy Mix.jpg`,
                            `/Images/1kg/Healthy Mix.jpeg`,
                            `/Items/Health Mix.jpeg`,
                            `/Items/Health Mix.jpg`
                          ];
                          fallbackList.push(...forced);
                        }
                      } else if (titleLower.includes('coffee') && titleLower.includes('powder')) {
                        // Coffee powder: custom 1kg image name 'Cofee Powder.jpg' (as provided)
                        const current = (modalWeights[modalWeights.length-1] || '').toLowerCase();
                        if (current.includes('1kg')) {
                          primary = `/Images/1kg/Cofee Powder.jpg`;
                          const forced = [
                            `/Images/1kg/Coffee powder.jpg`,
                            `/Images/500/Coffee powder.jpg`,
                            `/Images/500/Coffee powder.jpeg`
                          ];
                          fallbackList.push(...forced);
                        } else {
                          // Default to 500g view
                          primary = `/Images/500/Coffee powder.jpg`;
                          const forced = [
                            `/Images/1kg/Cofee Powder.jpg`,
                            `/Images/1kg/Coffee powder.jpg`
                          ];
                          fallbackList.push(...forced);
                        }
                      } else if (titleLower.includes('turmaric') || ((titleLower.includes('turmeric') || titleLower.includes('manjal')) && titleLower.includes('powder'))) {
                        // Force to use the provided Turmaric Powder 250g image
                        primary = `/Images/250/Turmaric Powder.jpg`;
                        const forced = [
                          `/Images/250/Turmeric Powder.jpg`,
                          `/Images/250/Turmeric Powder.jpeg`
                        ];
                        fallbackList.push(...forced);
                      } else {
                        nameVariants.forEach(n => exts.forEach(ext => fallbackList.push(`/Images/${folder}/${n}.${ext}`)));
                      }
                      // also allow whatever was previously computed image path
                      if (modalProduct.image) fallbackList.push(String(modalProduct.image));
                      return (
                        <img
                          src={primary}
                          alt={modalProduct.name}
                          data-fallback={fallbackList.join(',')}
                          onError={(e:any)=>{
                            const el = e.currentTarget as HTMLImageElement;
                            const list = (el.getAttribute('data-fallback')||'').split(',').filter(Boolean);
                            if (list.length){ el.src = list.shift() as string; el.setAttribute('data-fallback', list.join(',')); } else { el.style.display='none'; }
                          }}
                          className="max-w-full max-h-full object-contain"
                        />
                      );
                    })()
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                      <p>No Image Available</p>
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="space-y-4">
                  {/* Dynamic Discount Badge */}
                  <div>
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-md animate-pulse">15% OFF</span>
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{modalProduct.name}</h3>
                  
                  {/* Category */}
                  <p className="text-gray-600">{modalProduct.category}</p>
                  
                  {/* Dynamic Price */}
                  <div className="flex items-center gap-3">
                    {isProductAvailable(modalProduct.name) ? (
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{modalProduct.price}</span>
                    ) : (
                      <span className="text-base sm:text-lg font-semibold text-gray-500">Coming soon</span>
                    )}
                  </div>
                  
                  {/* Weight selector + individual quantities */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {(() => {
                        const tl = modalProduct.name.toLowerCase();
                        let weights: string[];
                        if (tl.includes('health mix') || tl.includes('healthmix')) {
                          // Exactly 250g only
                          weights = ['250g'];
                        } else if (tl.includes('coffee') && tl.includes('powder')) {
                          // Coffee powder: 500g only
                          weights = ['500g'];
                        } else {
                          weights = (
                            tl.includes('puliyotharai') || tl.includes('puliodharai') ||
                            tl.includes('vathakkuzhambu') || tl.includes('vathakulambu') ||
                            ((tl.includes('turmeric') || tl.includes('manjal')) && tl.includes('powder')) ||
                            ((tl.includes('poondu') || tl.includes('poondhu')) && (tl.includes('idli') || tl.includes('idly'))) ||
                            ((tl.includes('andra') || tl.includes('andhra')) && (tl.includes('spl') || tl.includes('special')) && tl.includes('paruppu') && tl.includes('powder'))
                          )
                            ? ['250g']
                            : (allowedWeightsForProduct(modalProduct.name) as unknown as string[]);
                        }
                        return weights.map((w) => (
                          <button
                            key={w}
                            onClick={() => setModalWeights(prev => prev.includes(w) ? prev.filter(x=>x!==w) : [...prev, w])}
                            className={`px-3 py-1.5 rounded-full border text-sm ${modalWeights.includes(w) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}
                          >
                            {w}
                          </button>
                        ));
                      })()}
                    </div>
                    
                    {/* Individual quantity inputs for selected weights */}
                    {modalWeights.length > 0 && (
                      <div className="space-y-2">
                        {modalWeights.map(weight => (
                          <div key={weight} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-sm font-medium text-gray-700">{weight} Quantity:</span>
                            <input 
                              type="number" 
                              min={1} 
                              value={modalQuantities[weight] || 1} 
                              onChange={e => setModalQuantities(prev => ({
                                ...prev,
                                [weight]: Math.max(1, parseInt(e.target.value || '1'))
                              }))}
                              className="w-16 border rounded px-2 py-1 text-center"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Description</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {modalProduct.description?.split(': ')[1] || modalProduct.description}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    {(() => {
                      const lower = modalProduct.name.toLowerCase();
                      const isVathak = lower.includes('vathakkuzhambu') || lower.includes('vathakulambu');
                      const isPuliyo = lower.includes('puliyotharai') || lower.includes('puliodharai');
                      const isPoondu = (lower.includes('poondu') || lower.includes('poondhu')) && (lower.includes('idli') || lower.includes('idly'));
                      const isAndra = (lower.includes('andra') || lower.includes('andhra')) && (lower.includes('spl') || lower.includes('special')) && lower.includes('paruppu') && lower.includes('powder');
                      const isHealth = lower.includes('health mix') || lower.includes('healthmix');
                      const isTurmeric = (lower.includes('turmeric') || lower.includes('manjal')) && lower.includes('powder');
                      const isCoffee = lower.includes('coffee') && lower.includes('powder');
                      const canBuy = isVathak || isPuliyo || isPoondu || isAndra || isHealth || isTurmeric || isCoffee;
                      if (!canBuy) {
                        return (
                          <div className="w-full text-center py-3 px-6 rounded-lg bg-gray-100 text-gray-600 font-semibold">
                            Coming soon
                          </div>
                        );
                      }
                      return (
                        <>
                          <button 
                            onClick={handleModalBuyNow}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <ShoppingCart className="h-5 w-5" />
                            <span>Buy Now</span>
                          </button>
                          <button 
                            onClick={handleModalAddToCart}
                            className={`w-full font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                              isInCart(modalProduct.name) 
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                          >
                            {isInCart(modalProduct.name) ? (
                              <><Check className="h-5 w-5" /><span>Added to Cart</span></>
                            ) : (
                              <><Plus className="h-5 w-5" /><span>Add to Cart</span></>
                            )}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
