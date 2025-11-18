import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu,
  X,
  ShoppingCart,
  
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Heart,
  Leaf,
  Award,
  
  Package,
  Sparkles,
  Crown,
  Gift,
  
  Coffee,
  Expand,
  ChevronLeft,
  Plus
} from 'lucide-react';
import { categories } from '../data/categories';
import { createCategoryUrl, toSlug } from '../utils/slugUtils';
import { getProductPrice, isProductAvailable } from '../data/availability';
import { hasUserClaimedFirstOrderDiscount } from '../hooks/useFirstOrderPopup';
import { getShortDescription } from '../data/shortDescriptions';
import { getImageOverride } from '../data/imageOverrides';

// Custom CSS for premium styling
const customStyles = `
  .corporate-blue {
    color: #1e3a8a;
  }
  .corporate-blue-bg {
    background-color: #1e3a8a;
  }
  .corporate-blue-border {
    border-color: #1e3a8a;
  }
  .corporate-blue-gradient {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  }
  .animation-delay-300 {
    animation-delay: 0.3s;
  }
  .animation-delay-600 {
    animation-delay: 0.6s;
  }
  .fast-moving-label {
    background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 4px 8px rgba(220, 38, 38, 0.25);
  }
  .special-dish-label {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 4px 8px rgba(30, 64, 175, 0.25);
  }
  .enhanced-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid rgba(30, 64, 175, 0.1);
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .enhanced-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(30, 64, 175, 0.1), 0 10px 10px -5px rgba(30, 64, 175, 0.05);
    border-color: rgba(30, 64, 175, 0.2);
  }
  .product-image-container {
    position: relative;
    overflow: hidden;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  .product-image {
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .product-image-container:hover .product-image {
    transform: scale(1.08);
  }
  .label-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .enhanced-header {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(30, 64, 175, 0.1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  .enhanced-button {
    background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
    box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.25);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.025em;
  }
  .enhanced-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.3), 0 4px 6px -2px rgba(220, 38, 38, 0.15);
  }
  .enhanced-section {
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  }
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
  .brand-duo-text {
    background: linear-gradient(135deg, #991b1b 0%, #1e3a8a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 10px rgba(30, 64, 175, 0.1);
  }
  
  /* Pure Tailwind CSS approach - no custom media queries needed */
  
  /* @keyframes scroll - DISABLED */
  /* .animate-scroll - DISABLED */
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const Homepage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showChatText, setShowChatText] = useState(true);
  const { user, profile } = useAuth();
  
  // Scroll to a section if requested via navigation state (e.g., { scrollTo: 'categories' })
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const el = document.getElementById(state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  }, [location.state]);
  
  // Check if user has claimed first order discount (50% off)
  const hasClaimedFirstOrderDiscount = localStorage.getItem('firstOrderDiscountClaimed') === 'true';
  
  // Check if user has completed their first order
  const hasCompletedFirstOrder = user?.id ? localStorage.getItem(`firstOrderCompleted_${user.id}`) === 'true' : false;
  
  // Debug logging for production troubleshooting
  useEffect(() => {
    console.log('🔍 Homepage Discount Debug:', {
      isProduction,
      hasUser: !!user,
      hasClaimedFirstOrderDiscount,
      hasCompletedFirstOrder,
      hasDiscountEligibility,
      hostname: window.location.hostname
    });
  }, []);
  
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
      console.log('🧹 Production: Cleared discount flags');
    }
  }, [isProduction]);

  // Create refs for scroll containers
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Auto-scroll state for products section
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [lastUserInteraction, setLastUserInteraction] = useState(Date.now());
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Scroll function for category items
  const scrollCategory = (categoryIndex: number, direction: 'left' | 'right') => {
    const scrollContainer = scrollRefs.current[`category-${categoryIndex}`];
    if (scrollContainer) {
      const scrollAmount = 280; // Width of one card + gap
      const currentScroll = scrollContainer.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Check if scroll is needed
  const [scrollStates, setScrollStates] = useState<{ [key: string]: { canScrollLeft: boolean, canScrollRight: boolean } }>({});
  
  const updateScrollState = (categoryIndex: number) => {
    const scrollContainer = scrollRefs.current[`category-${categoryIndex}`];
    if (scrollContainer) {
      const canScrollLeft = scrollContainer.scrollLeft > 0;
      const canScrollRight = scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      setScrollStates(prev => ({
        ...prev,
        [`category-${categoryIndex}`]: { canScrollLeft, canScrollRight }
      }));
    }
  };
  
  // Auto-scroll functions for products section
  const startAutoScroll = () => {
    const container = scrollRefs.current['all-products'];
    if (!container || isAutoScrolling) return;
    
    setIsAutoScrolling(true);
    
    autoScrollInterval.current = setInterval(() => {
      if (container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        
        if (currentScroll >= maxScroll) {
          // Reset to beginning when reached end
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll right by one card width
          container.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 2000); // Scroll every 2 seconds
  };
  
  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };
  
  const resetAutoScrollTimer = () => {
    setLastUserInteraction(Date.now());
    stopAutoScroll();
    
    // Clear existing timer
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }
    
    // Start new timer for 3 seconds
    autoScrollTimer.current = setTimeout(() => {
      startAutoScroll();
    }, 3000);
  };
  
  const handleUserScroll = () => {
    resetAutoScrollTimer();
  };
  
  const handleMouseEnter = () => {
    stopAutoScroll();
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }
  };
  
  const handleMouseLeave = () => {
    resetAutoScrollTimer();
  };
  
  // Auto-scroll initialization and cleanup
  useEffect(() => {
    // Start auto-scroll after initial delay
    const initialTimer = setTimeout(() => {
      startAutoScroll();
    }, 3000);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimer);
      stopAutoScroll();
      if (autoScrollTimer.current) {
        clearTimeout(autoScrollTimer.current);
      }
    };
  }, []); // Empty dependency array for mount/unmount only
  
  // Extract item title (before colon)
  const getItemTitle = (item: string): string => {
    return item.includes(':') ? item.split(':')[0].trim() : item;
  };

  // Comprehensive image mapping - Updated to use ALL available images
  const productImageMap: { pattern: RegExp; src: string; category?: string }[] = [
    // Powder category - exact matches with available images
    { pattern: /^turmeric.*powder|manjal.*powder/i, src: '/Items/Turmeric Powder.jpeg', category: 'Powder' },
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

    // 0) Per-product override (e.g., Vathakkuzhambu Mix 250g image in /Images/250)
    const override = getImageOverride(cleanProductName);
    if (override) return override;

    // 1) Try explicit mapping under /Items first
    const lower = cleanProductName.toLowerCase();
    const mapped = productImageMap.find((m) => !m.category || m.category === categoryTitle ? m.pattern.test(lower) : false);
    if (mapped) return mapped.src;

    // 2) Otherwise, fall back to new /Images structure
    const folders = ['100', '500', '1kg'];
    const first = folders[0];
    const imagePath = `/Images/${first}/${cleanProductName}`;
    return `${imagePath}.webp`;
  };

  // testimonials reserved for future use
  // const testimonials = [...];

  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  // };
  // 
  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  // };
  
  // Initialize scroll states when component mounts
  useEffect(() => {
    // Slight delay to ensure DOM is ready
    setTimeout(() => {
      categories.forEach((_, categoryIndex) => {
        updateScrollState(categoryIndex);
      });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-100">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />



      {/* Hero Section - Responsive Image Display (Desktop vs Mobile) */}
      <section
        id="home"
        className="relative w-full 
                   h-[60vh] min-h-[400px] max-h-[600px] 
                   sm:h-[65vh] sm:min-h-[450px] sm:max-h-[650px] 
                   md:h-[70vh] md:min-h-[500px] md:max-h-[700px] 
                   lg:h-[75vh] lg:min-h-[550px] lg:max-h-[750px] 
                   xl:h-[80vh] xl:min-h-[600px] xl:max-h-[800px] 
                   bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 
                   border-b border-gray-200 overflow-hidden
                   flex items-center justify-center"
      >
        {/* Desktop hero image (hidden on mobile) */}
        <img 
          src="https://res.cloudinary.com/ddl1xlonf/image/upload/v1763454063/all_images_dmqhhp.jpg" 
          alt="Shree Raaga SWAAD GHAR - Complete Product Collection" 
          className="hidden md:block max-w-full max-h-full w-auto h-auto object-contain"
          width={1600}
          height={900}
          loading="eager"
          decoding="async"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Mobile hero image (hidden on desktop) */}
        <img 
          src="/Items/Mobile1.jpeg" 
          alt="Shree Raaga SWAAD GHAR - Mobile Optimized View" 
          className="block md:hidden max-w-full max-h-full w-auto h-auto object-contain"
          width={800}
          height={1200}
          loading="eager"
          decoding="async"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        
        {/* Enhanced Fallback placeholder */}
        <div className="hidden absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
          <div className="text-center p-6 max-w-sm mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-xl border border-orange-200">
              <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-orange-800 mb-3">Shree Raaga SWAAD GHAR</h2>
            <p className="text-base font-medium text-orange-600 mb-2">Authentic Traditional Products</p>
            <p className="text-sm text-orange-500">Loading banner image...</p>
          </div>
        </div>
      </section>

      {/* Welcome Section - Below Cover Image */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-slate-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-8 w-32 h-32 border-2 border-red-300 rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 border border-amber-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-blue-300/50 rounded-full"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block bg-gradient-to-r from-red-600 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                Welcome to
              </span>
              <span className="block text-slate-800 mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                Shree Raaga SWAAD GHAR
              </span>
            </h1>
            
            <div className="flex items-center justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-red-400 to-transparent flex-1 max-w-16 sm:max-w-32"></div>
              <div className="mx-3 sm:mx-4 p-1.5 sm:p-2 bg-gradient-to-r from-amber-100 to-red-100 rounded-full">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-red-400 to-transparent flex-1 max-w-16 sm:max-w-32"></div>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-slate-700 italic">
              Authentic Traditional Flavors
            </p>
          </div>
        </div>
      </section>

      {/* Our Products Section - Horizontal Scroll */}
      <section id="categories" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-50 via-slate-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold corporate-blue mb-4 sm:mb-6 tracking-tight">
              Our Products
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-red-600 max-w-3xl mx-auto font-medium italic px-4">
              Discover our complete collection of authentic Indian spices and products
            </p>
          </div>

          {/* Horizontal Scrolling Products */}
          <div className="relative">
            <div 
              ref={el => scrollRefs.current['all-products'] = el}
              className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 pb-4 sm:pb-6 scrollbar-hide px-2 sm:px-4" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={handleUserScroll}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleMouseEnter}
              onTouchEnd={handleMouseLeave}
            >
              {(() => {
                // Flatten all products from all categories
                const allProducts: Array<{ item: string, category: string, categoryTitle: string }> = [];
                categories.forEach(category => {
                  category.items.forEach(item => {
                    allProducts.push({
                      item,
                      category: category.title,
                      categoryTitle: category.title
                    });
                  });
                });
                
                const hasImage = (title: string) => {
                  const lower = title.toLowerCase();
                  const isVathak = lower.includes('vathakkuzhambu') || lower.includes('vathakulambu');
                  const isPuliyo = lower.includes('puliyotharai') || lower.includes('puliodharai');
                  const isPoondu = (lower.includes('poondu') || lower.includes('poondhu')) && (lower.includes('idli') || lower.includes('idly'));
                  const isAndra = (lower.includes('andra') || lower.includes('andhra')) && (lower.includes('spl') || lower.includes('special')) && lower.includes('paruppu') && lower.includes('powder');
                  const isHealth = lower.includes('health mix') || lower.includes('healthmix');
                  const isTurmeric = (lower.includes('turmeric') || lower.includes('manjal')) && lower.includes('powder');
                  const isCoffee = lower.includes('coffee') && lower.includes('powder');
                  return isVathak || isPuliyo || isPoondu || isAndra || isHealth || isTurmeric || isCoffee;
                };

                const products = allProducts.sort((a,b) => (hasImage(getItemTitle(b.item))?1:0) - (hasImage(getItemTitle(a.item))?1:0));

                return products.map((product, index) => {
                  const itemTitle = getItemTitle(product.item);
                  const imgSrc = getProductImage(itemTitle, product.category);
                  
                  const goToProduct = () => {
                    if (!isProductAvailable(itemTitle)) return;
                    navigate('/product-details', {
                      state: {
                        product: {
                          name: itemTitle,
                          category: product.category,
                          price: getProductPrice(itemTitle),
                          description: getShortDescription(itemTitle) || 'Ready-to-cook authentic traditional mix',
                          image: imgSrc
                        }
                      }
                    });
                  };
                  
                  return (
                    <div 
                      key={index}
                      onClick={goToProduct}
                      className="flex-none w-64 sm:w-72 md:w-80 lg:w-96 group cursor-pointer"
                    >
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group-hover:-translate-y-1 relative">
                        {/* Dynamic Discount Badge */}
                        <div className="absolute top-3 right-3 z-20">
                          {!isProductAvailable(itemTitle) && (
                            <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
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
                                      ? 'Turmeric Powder'
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
                              <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-2xl bg-white">
                                <img
                                  src={candidates[0]}
                                  data-fallback={candidates.slice(1).join(',')}
                                  alt={itemTitle}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-contain object-center p-2 bg-white"
                                  onError={(e:any) => {
                                    const el = e.currentTarget as HTMLImageElement;
                                    const list = (el.getAttribute('data-fallback')||'').split(',').filter(Boolean);
                                    if (list.length) { el.src = list.shift() as string; el.setAttribute('data-fallback', list.join(',')); }
                                    else { el.style.display='none'; }
                                  }}
                                />
                              </div>
                            );
                          }
                          return (
                            <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="px-3 py-1.5 rounded-full bg-gray-800 text-white text-xs font-semibold shadow">Coming soon</span>
                              </div>
                            </div>
                          );
                        })()}
                        
                        {/* Product Details */}
                      <div className="p-4 sm:p-5 md:p-6">
                          <h3 className="text-gray-800 font-bold text-base sm:text-lg md:text-xl mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '3rem'
                          }}>
                            {itemTitle}
                          </h3>
                          
                          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-5">{getShortDescription(itemTitle) || 'Ready-to-cook authentic traditional mix'}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                              {!isProductAvailable(itemTitle) ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold border border-gray-200">
                                  Coming soon
                                </span>
                              ) : (
                                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">₹{getProductPrice(itemTitle)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()
              }
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => {
                const container = scrollRefs.current['all-products'];
                if (container) {
                  container.scrollBy({ left: -320, behavior: 'smooth' });
                }
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200 z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-600" />
            </button>
            
            <button 
              onClick={() => {
                const container = scrollRefs.current['all-products'];
                if (container) {
                  container.scrollBy({ left: 320, behavior: 'smooth' });
                }
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/95 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200 z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-600" />
            </button>
          </div>
        </div>
      </section>



      {/* Brand Story Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-full max-w-sm h-64 bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl shadow-lg flex items-center justify-center border border-blue-100">
                  <img
                    src="/logo.png"
                    alt="Shree Raga SWAAD GHAR Logo"
                    className="h-40 w-40 object-contain drop-shadow-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden h-40 w-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center drop-shadow-xl">
                    <Leaf className="h-16 w-16 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold corporate-blue tracking-tight">Our Heritage Story</h2>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  Prepared the age-old way with handpicked ingredients and no artificial additives, our foods carry the true flavor of our heritage, straight from our kitchen to yours.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  Every product at Shree Raaga Swaad Ghar tells a story of tradition, passed down through generations of culinary expertise and refined with modern care.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  Shree Raaga Swaad Ghar is where flavors sing the melody of tradition. Every jar of pickle, every spoon of podi, every drop of chekku oil and ghee is a tribute to timeless recipes passed down through generations. Blended with the purity of nature and the care of handmade preparation, our creations carry the essence of a bygone era, touched with the finesse of modern taste. Here, every bite is not just food — it’s a memory, a story, and a celebration of heritage.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="text-center">
                    <Award className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold corporate-blue italic">Premium Quality</p>
                  </div>
                  <div className="text-center">
                    <Leaf className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold corporate-blue italic">Natural Ingredients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Get In Touch
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium italic">
              Ready to experience authentic flavors? Contact us today!
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-2xl w-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-blue-200 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white text-lg font-medium mb-1">Address</p>
                      <p className="text-white/90 text-sm leading-relaxed">
                        99/50 Gopala Krishna Swamy Kovil Street<br/>
                        Krishnapuram, Tenkasi - 627759
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6 text-blue-200 flex-shrink-0" />
                    <div>
                      <p className="text-white text-lg font-medium">Email</p>
                      <p className="text-white/90">shreeraagaswaadghar@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-6 w-6 text-blue-200 flex-shrink-0" />
                    <div>
                      <p className="text-white text-lg font-medium">Phone</p>
                      <p className="text-white/90">+91 90250 85523</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <svg className="h-6 w-6 text-blue-200 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                    <div>
                      <p className="text-white text-lg font-medium">WhatsApp</p>
                      <p className="text-white/90">+91 7305391377</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <svg className="h-6 w-6 text-blue-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                    <div>
                      <p className="text-white text-lg font-medium">Online Store</p>
                      <a href="https://www.shreeraagaswaadghar.com" className="text-blue-300 hover:text-blue-200 transition-colors">
                        www.shreeraagaswaadghar.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Chat Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-2">
        {/* Chat with us text - conditionally rendered */}
        {showChatText && (
          <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2">
            <span className="text-sm font-medium text-black whitespace-nowrap">Chat with us</span>
            <button 
              onClick={() => setShowChatText(false)}
              className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Hide chat text"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/917305391377" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
          </svg>
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
                              <div className="flex items-center space-x-2 mb-6">
                  <Coffee className="h-8 w-8 text-red-400" />
                  <span className="text-xl font-bold">Shree Raaga SWAAD GHAR</span>
                </div>
              <p className="text-gray-300 leading-relaxed font-medium">
                Bringing timeless taste of tradition to your table with authentic Indian flavors made with love and care.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/#categories" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="/#about" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/terms-and-conditions.html" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a href="/cancellation-refund.html" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                    Cancellation &amp; Refund Policy
                  </a>
                </li>
                <li>
                  <a href="/shipping-policy.html" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy.html" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/contact-us.html" className="text-gray-300 hover:text-red-400 transition-colors duration-300">
                    Contact Us Page
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-red-400" />
                  <span className="text-gray-300">+91 90250 85523</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-red-400" />
                  <span className="text-gray-300">shreeraagaswaadghar@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-red-400" />
                  <span className="text-gray-300">Krishnapuram, Tenkasi</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-400">Follow Us</h4>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-gray-300 hover:text-red-400 cursor-pointer transition-colors duration-300" />
                <Instagram className="h-6 w-6 text-gray-300 hover:text-red-400 cursor-pointer transition-colors duration-300" />
                <Twitter className="h-6 w-6 text-gray-300 hover:text-red-400 cursor-pointer transition-colors duration-300" />
              </div>

            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 Shree Raaga SWAAD GHAR. All rights reserved. Made with ❤️ for traditional flavors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;