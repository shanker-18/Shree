import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package, ArrowLeft } from 'lucide-react';
import { categories } from '../data/categories';
import { toSlug } from '../utils/slugUtils';

// Extract just the title part (before the colon) from a full item string
const getItemTitle = (item: string): string => {
  return item.includes(':') ? item.split(':')[0].trim() : item;
};

// Comprehensive image mapping for all categories
const productImageMap: { pattern: RegExp; src: string; category?: string }[] = [
  // Powders category
  { pattern: /turmeric|manjal/i, src: '/Items/Turmeric Powder.jpeg', category: 'Powder' },
  { pattern: /idli|idly/i, src: '/Items/Idli Powder.jpeg', category: 'Powder' },
  { pattern: /rasam/i, src: '/Items/Rasam Powder.jpeg', category: 'Powder' },
  { pattern: /pulikuzhambu.*powder/i, src: '/Items/Puliyokuzhambu Powder.jpg', category: 'Powder' },
  { pattern: /andra.*spl.*paruppu.*powder|andhra.*spcl.*powder/i, src: '/Items/andhra spcl.jpg', category: 'Powder' },
  { pattern: /moringa.*leaf.*powder/i, src: '/Items/moringa leaf powder.jpg', category: 'Powder' },
  { pattern: /curry.*leaves.*powder|curry.*leaf.*powder/i, src: '/Items/curry leaf powder.jpg', category: 'Powder' },
  
  // Mix & Pickle category
  { pattern: /puliyotharai|tamarind.*mix/i, src: '/Items/Puliyotharai Mix.jpeg', category: 'Mix & Pickle' },
  { pattern: /vathakkuzhambu.*mix|vathal.*kuzhambu.*mix/i, src: '/Items/Vathakkuzhambu Mix.jpeg', category: 'Mix & Pickle' },
  { pattern: /garlic.*pickle|poondu.*pickle/i, src: '/Items/Garlic Pickle.jpeg', category: 'Mix & Pickle' },
  { pattern: /pirandai.*pickle/i, src: '/Items/Pirandai pickle.jpeg', category: 'Mix & Pickle' },
  { pattern: /jadhikkai|jathikkai|nutmeg/i, src: '/Items/Jadhikkai Pickle.jpeg', category: 'Mix & Pickle' },
  { pattern: /mudakatthan|mudakkathan/i, src: '/Items/Mudakatthan Pickle.jpeg', category: 'Mix & Pickle' },
  { pattern: /kara.*narthangai.*pickle/i, src: '/Items/Kara narthangai pickle.jpeg', category: 'Mix & Pickle' },
  
  // Coffee category
  { pattern: /coffee.*powder/i, src: '/Items/coffee powder.jpg', category: 'Coffee' },
  { pattern: /coffee.*large/i, src: '/Items/Coffee large.jpg', category: 'Coffee' },
];

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

const Categories: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-600">
            Our Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collection of authentic traditional products
          </p>
        </div>
        
         {/* Grid layout with 3 items per row for larger screens; page retained in case it's bookmarked */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* First row - 3 categories */}
          {categories.slice(0, 3).map((category, index) => (
            <div 
              key={index}
              className={`rounded-xl shadow-lg overflow-hidden border ${category.borderColor} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}
            >
              {/* Header with gradient */}
              <div className={`h-32 bg-gradient-to-r ${category.gradient} p-6 relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 right-2 w-12 h-12 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/50 rounded-full"></div>
                </div>
                
                {/* Title */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                  <p className="text-white/80 text-sm">{category.description}</p>
                </div>
              </div>
              
              {/* Product Images Grid */}
              <div className={`${category.bgColor} p-6`}>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {category.items.slice(0, 4).map((item, idx) => {
                    const itemTitle = getItemTitle(item);
                    const imgSrc = getProductImage(itemTitle, category.title);
                    
                    return (
                      <div key={idx} className="bg-white rounded-lg border border-gray-200 p-2 hover:shadow-md transition-all duration-200 group">
                        {imgSrc ? (
                          <div className="w-full h-20 bg-white border border-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                            <img 
                              src={imgSrc} 
                              alt={itemTitle} 
                              className="max-w-full max-h-full object-contain rounded group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-20 bg-gray-50 border border-dashed border-gray-200 rounded-md mb-2 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                        <p className={`${category.textColor} text-xs font-medium text-center leading-tight`} style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden' 
                        }}>
                          {itemTitle}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                {category.items.length > 4 && (
                  <p className="text-xs text-gray-500 text-center italic">+{category.items.length - 4} more products</p>
                )}
                
                {/* Action button */}
                <div className="mt-4">
                  <Link to={`/category/${toSlug(category.title)}`}>
                    <button className={`w-full bg-gradient-to-r ${category.gradient} text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm group`}>
                      <Package className="h-3.5 w-3.5" />
                      <span>Explore All</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Second row - 3 categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(3, 6).map((category, index) => (
            <div 
              key={index + 3}
              className={`rounded-xl shadow-lg overflow-hidden border ${category.borderColor} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}
            >
              {/* Header with gradient */}
              <div className={`h-32 bg-gradient-to-r ${category.gradient} p-6 relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 right-2 w-12 h-12 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/50 rounded-full"></div>
                </div>
                
                {/* Title */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                  <p className="text-white/80 text-sm">{category.description}</p>
                </div>
              </div>
              
              {/* Product Images Grid */}
              <div className={`${category.bgColor} p-6`}>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {category.items.slice(0, 4).map((item, idx) => {
                    const itemTitle = getItemTitle(item);
                    const imgSrc = getProductImage(itemTitle, category.title);
                    
                    return (
                      <div key={idx} className="bg-white rounded-lg border border-gray-200 p-2 hover:shadow-md transition-all duration-200 group">
                        {imgSrc ? (
                          <div className="w-full h-20 bg-white border border-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                            <img 
                              src={imgSrc} 
                              alt={itemTitle} 
                              className="max-w-full max-h-full object-contain rounded group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-20 bg-gray-50 border border-dashed border-gray-200 rounded-md mb-2 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                        <p className={`${category.textColor} text-xs font-medium text-center leading-tight`} style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical', 
                          overflow: 'hidden' 
                        }}>
                          {itemTitle}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                {category.items.length > 4 && (
                  <p className="text-xs text-gray-500 text-center italic">+{category.items.length - 4} more products</p>
                )}
                
                {/* Action button */}
                <div className="mt-4">
                  <Link to={`/category/${toSlug(category.title)}`}>
                    <button className={`w-full bg-gradient-to-r ${category.gradient} text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 text-sm group`}>
                      <Package className="h-3.5 w-3.5" />
                      <span>Explore All</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;