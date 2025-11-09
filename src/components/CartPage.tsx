import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Package, Gift, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartSubtotal, getDiscount, hasFreeSamples, hasPaidItems, clearCart } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      
      // Convert cart items to order format
      const orderItems = cartItems.map(item => ({
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        isSample: item.isSample || false // Preserve sample flag
      }));

      // Check if cart contains free samples
      const hasSamples = cartItems.some(item => item.isSample || item.price === 0);

      const totalAmount = getCartTotal();
      const discountAmount = 0; // You can add discount logic here
      const finalAmount = totalAmount - discountAmount;

      console.log('📦 Cart checkout - items:', orderItems);
      console.log('🆓 Has samples:', hasSamples);

      // For authenticated users, go directly to order details
      // For guests, the OrderDetails component will handle the flow
      navigate('/order-details', {
        state: {
          isAuthenticated: !!profile,
          items: orderItems,
          total_amount: totalAmount,
          discount_amount: discountAmount,
          final_amount: finalAmount,
          isFromCart: true,
          isFromSamples: hasSamples, // Add this flag
          containsSamples: hasSamples // Additional flag for clarity
        }
      });
    }, 1000);
  };

  const handleBuySelected = (selectedItems: string[]) => {
    if (selectedItems.length === 0) return;
    
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    const orderItems = selectedCartItems.map(item => ({
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      category: item.category
    }));

    const totalAmount = selectedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountAmount = 0;
    const finalAmount = totalAmount - discountAmount;

    navigate('/order-details', {
      state: {
        isAuthenticated: !!profile,
        items: orderItems,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        isFromCart: true
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-sm">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to discover our amazing products!
            </p>
            <Link to="/#categories">
              <button className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                  <ShoppingBag className="h-6 w-6 mr-2 text-red-600" />
                  Shopping Cart ({cartItems.length} items)
                </h1>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-8 w-8 text-red-600" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{item.product_name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-lg font-bold text-red-600">₹{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Sample Offer Banner */}
              {hasFreeSamples() && hasPaidItems() && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">🎉 Sample Discount Applied!</h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    You're getting <span className="font-bold">20% off</span> on paid items because you have free samples in your cart!
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{getCartSubtotal()}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      <span>Sample Discount (20%)</span>
                    </div>
                    <span>-₹{getDiscount().toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                
                <Link to="/#categories">
                  <button className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-300">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
