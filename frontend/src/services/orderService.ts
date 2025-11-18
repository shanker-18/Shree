// Order service implementation

import { sendWarehouseEmail } from './email';
import { API_ENDPOINTS } from '../config/api';

// Function to check if this is a user's first order
function isFirstTimeOrder(userId: string | null | undefined): boolean {
  if (!userId) return false;
  
  // Check localStorage for previous orders
  const previousOrders = localStorage.getItem(`orders_${userId}`);
  if (!previousOrders) return true;
  
  try {
    const orders = JSON.parse(previousOrders);
    return orders.length === 0;
  } catch (error) {
    console.error('Error checking first time order status:', error);
    return false;
  }
}
// Don't import useDemoContext hook here as it can only be used in React components

// Function to place an order and send warehouse email
export const placeOrder = async (order: any) => {
  try {
    // save order to Supabase (API call)
    const response = await fetch(API_ENDPOINTS.ORDERS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save order: ${response.statusText}`);
    }
    
    // send warehouse email
    const emailResult = await sendWarehouseEmail(order);
    
    return {
      success: true,
      orderResult: await response.json(),
      emailResult
    };
  } catch (error: any) {
    console.error("Error in placeOrder:", error);
    return {
      success: false,
      error: error.message || "Failed to place order"
    };
  }
};

// Define order interface
interface OrderData {
  user_id?: string | null;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    category: string;
  }>;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  is_guest: boolean;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

// Create order function
export async function createOrder(orderData: OrderData) {
  try {
    // Try to save to Supabase via the backend API
    try {
      // Generate a short, user-friendly order ID
      const orderId = (() => {
        const ts = Date.now().toString(36).toUpperCase();
        const rand = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `RG-${ts}-${rand}`;
      })();
      
      // Get user state from profile if available
      let userState = '';
      if (orderData.user_id) {
        const savedProfile = localStorage.getItem(`profile_${orderData.user_id}`);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          userState = profile.state || '';
        }
      }
      
      // Determine delivery time based on state
      const deliveryDate = userState === 'Tamil Nadu' ? '3-5 days' : '10 days';
      
      // Format the order data for Supabase backend
      const orderDataForBackend = {
        order_id: orderId, // Use the generated UUID
        user_id: orderData.user_id || null,
        guest_name: orderData.guest_name,
        guest_phone: orderData.guest_phone,
        guest_address: orderData.guest_address,
        state: userState,
        items: orderData.items.map(item => ({
          name: item.product_name,
          qty: item.quantity,
          price: item.price
        })),
        total_price: orderData.final_amount,
        payment_status: 'confirmed', // Set to confirmed as per requirements
        delivery_date: deliveryDate, // Set based on state
        status: 'pending', // Initial status
        isFirstTimeOrder: isFirstTimeOrder(orderData.user_id)
      };
      
      console.log('Sending order to Supabase backend:', orderDataForBackend);
      
      // Save to Supabase using the backend API
      const response = await fetch(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDataForBackend)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Supabase save result via backend:', result);
      
      if (result.success && result.order) {
        // Use the order_id from the backend response
        const savedOrderId = result.order.order_id || orderId;
        const supabaseId = result.order.id; // Supabase auto-generated ID
        console.log('Order saved to Supabase successfully:', savedOrderId);
        console.log('Supabase ID:', supabaseId);
        
        // Check if order contains free samples and mark offer as used
        if (orderData.user_id && orderData.items.some(item => item.price === 0 || item.product_name.toLowerCase().includes('free sample'))) {
          markOfferAsUsed(orderData.user_id);
        }
        
        // Ongoing offer: no one-time first-order usage tracking
        
        // Store the order in localStorage as a backup
        storeOrderInLocalStorage({
          ...orderData,
          id: savedOrderId,
          supabase_id: supabaseId,
          order_id: savedOrderId,
          created_at: new Date().toISOString(),
          backend_saved: true,
          saved_to: 'supabase'
        });
        
        // NOTE: Email sending is now handled in OrderSummary.tsx when user clicks "Place Order"
        // This prevents emails from being sent during navigation to order summary
        
        return { success: true, orderId: savedOrderId, supabaseId };
      } else {
        throw new Error(result.message || result.error || 'Failed to save order to Supabase');
      }
    } catch (apiError) {
      console.error('Failed to save order to Supabase backend API:', apiError);
      // Continue to fallback methods
    }
    
    // Fallback to DemoContext if API fails
    // Create a simplified order object for DemoContext
    const simplifiedOrder = {
      user_id: orderData.user_id || undefined,
      guest_name: orderData.guest_name,
      guest_phone: orderData.guest_phone,
      guest_address: orderData.guest_address,
      items: orderData.items,
      final_amount: orderData.final_amount
    };
    
    // Use window object to access the global context instance
    if (typeof window !== 'undefined' && (window as any).__demoContext) {
      const result = await (window as any).__demoContext.createOrder(simplifiedOrder);
      console.log('Order saved to DemoContext:', result.orderId);
      
      // Check if order contains free samples and mark offer as used
      if (orderData.user_id && orderData.items.some(item => item.price === 0 || item.product_name.toLowerCase().includes('free sample'))) {
        markOfferAsUsed(orderData.user_id);
      }
      
      // Also store in localStorage as a backup
      storeOrderInLocalStorage({
        ...orderData,
        id: result.orderId,
        // Set order_id to be the same as id for consistency
        order_id: result.orderId,
        created_at: new Date().toISOString(),
        backend_saved: false,
        saved_to: 'demoContext'
      });
      
      return result;
    } else {
      // Final fallback to local storage if context is not available
      const orderId = (() => {
        const ts = Date.now().toString(36).toUpperCase();
        const rand = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `RG-${ts}-${rand}`;
      })();
      const newOrder = {
        ...orderData,
        id: orderId,
        // Set order_id to be the same as id for consistency
        order_id: orderId,
        created_at: new Date().toISOString(),
        backend_saved: false,
        saved_to: 'localStorage'
      };
      
      // Check if order contains free samples and mark offer as used
      if (orderData.user_id && orderData.items.some(item => item.price === 0 || item.product_name.toLowerCase().includes('free sample'))) {
        markOfferAsUsed(orderData.user_id);
      }
      
      // Store in localStorage
      storeOrderInLocalStorage(newOrder);
      
      console.log('Order saved to localStorage:', orderId);
      return { success: true, orderId };
    }
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Failed to create order' };
  }
}

// Helper function to mark special offer as used
function markOfferAsUsed(userId: string) {
  try {
    const savedProfile = localStorage.getItem(`profile_${userId}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      profile.hasUsedOffer = true;
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
      console.log('Special offer marked as used for user:', userId);
    }
  } catch (error) {
    console.error('Failed to mark offer as used:', error);
  }
}

// Helper function to mark first-order discount as used
function markFirstOrderDiscountAsUsed(userId: string) {
  try {
    const savedProfile = localStorage.getItem(`profile_${userId}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      profile.hasUsedOffer = true;
      profile.isFirstTimeOrder = false; // No longer first-time customer
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
    }
    
    // Mark discount as used in localStorage
    localStorage.setItem('firstOrderDiscountUsed', 'true');
    localStorage.setItem(`firstOrderDiscountUsed_${userId}`, 'true');
    console.log('First-order discount marked as used for user:', userId);
  } catch (error) {
    console.error('Failed to mark first-order discount as used:', error);
  }
}

// Helper function to store order in localStorage
function storeOrderInLocalStorage(order: any) {
  try {
    const existingOrders = localStorage.getItem('demo_orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(order);
    localStorage.setItem('demo_orders', JSON.stringify(orders));
    console.log('Order stored in localStorage:', order.id);
  } catch (error) {
    console.error('Failed to store order in localStorage:', error);
  }
}