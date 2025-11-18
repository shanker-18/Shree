import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  product_name?: string;
  name?: string; // For compatibility
  category: string;
  price: number;
  quantity: number;
  image?: string;
  isSample?: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getDiscount: () => number;
  getDiscountInfo: () => { type: string; percentage: number; amount: number };
  hasFreeSamples: () => boolean;
  hasPaidItems: () => boolean;
  isInCart: (productName: string) => boolean;
  getOriginalPrice: (price: number) => number;
  getDiscountedPrice: (price: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'id'>, quantity = 1) => {
    const itemName = item.name || item.product_name || 'Unknown Item';
    const newItem: CartItem = {
      ...item,
      product_name: item.product_name || item.name,
      name: item.name || item.product_name,
      quantity: item.quantity || quantity,
      id: `${itemName}-${Date.now()}`
    };
    
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.product_name === item.product_name && 
        cartItem.category === item.category
      );
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === existingItem.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const hasFreeSamples = () => {
    return cartItems.some(item => item.isSample === true);
  };

  const hasPaidItems = () => {
    return cartItems.some(item => !item.isSample && item.price > 0);
  };

  const getDiscount = () => {
    const paidItemsTotal = cartItems
      .filter(item => !item.isSample)
      .reduce((total, item) => total + (item.price * item.quantity), 0);

    // Ongoing offer: 15% off when the order total is ₹500 or more (reusable, no claim/usage flags)
    if (paidItemsTotal >= 500) {
      return paidItemsTotal * 0.15;
    }

    // Fallback: 10% discount if cart has both free samples and paid items
    if (hasFreeSamples() && hasPaidItems()) {
      return paidItemsTotal * 0.10;
    }

    return 0;
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getDiscount();
    return Math.max(0, subtotal - discount);
  };

  const isInCart = (productName: string) => {
    return cartItems.some(item => 
      item.product_name === productName || 
      item.name === productName
    );
  };

  const getDiscountInfo = () => {
    const paidItemsTotal = cartItems
      .filter(item => !item.isSample)
      .reduce((total, item) => total + (item.price * item.quantity), 0);

    if (paidItemsTotal >= 500) {
      return {
        type: 'Ongoing Offer',
        percentage: 15,
        amount: paidItemsTotal * 0.15
      };
    }

    if (hasFreeSamples() && hasPaidItems()) {
      return {
        type: 'Free Samples Discount',
        percentage: 10,
        amount: paidItemsTotal * 0.10
      };
    }

    return {
      type: 'No Discount',
      percentage: 0,
      amount: 0
    };
  };

  const getOriginalPrice = (price: number) => {
    // For the ongoing 15% offer, we do not alter per-item prices here.
    return price;
  };

  const getDiscountedPrice = (price: number) => {
    // Per-item pricing stays the same; discount is applied to the order total at checkout.
    return price;
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    getCartSubtotal,
    getDiscount,
    getDiscountInfo,
    hasFreeSamples,
    hasPaidItems,
    isInCart,
    getOriginalPrice,
    getDiscountedPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
