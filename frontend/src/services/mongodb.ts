// MongoDB Data API integration via server-side proxy
import { API_ENDPOINTS, fetchWithTimeout } from '../config/api';

// Configuration for server-side proxy
const API_BASE_URL = API_ENDPOINTS.ORDERS; // Use the server proxy instead of direct MongoDB API calls

// Interface for order data
interface OrderData {
  order_id: string;
  user_id?: string | null;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  items: Array<{
    name: string;
    qty: number;
  }>;
  total_price: number;
  payment_status: string;
  delivery_date: string;
  created_at?: string;
}

/**
 * Save an order to MongoDB using server-side proxy
 * @param orderData The order data to save
 * @returns Object with success status and order data or error message
 */
export async function saveOrderToMongoDB(orderData: OrderData) {
  try {
    // Add created_at timestamp if not provided
    if (!orderData.created_at) {
      orderData.created_at = new Date().toISOString();
    }

    // Make the API request to our server proxy with timeout
    const response = await fetchWithTimeout(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(orderData)
    }, 12000);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('MongoDB save result via proxy:', result);

    if (!result.success) {
      throw new Error(result.error || 'Failed to save order to MongoDB');
    }

    // Return the MongoDB document ID along with the order data
    return {
      success: true,
      order: result.order
    };
  } catch (error: any) {
    console.error('Error saving to MongoDB:', error);
    return {
      success: false,
      error: error.message || 'Failed to save order to MongoDB'
    };
  }
}

/**
 * Fetch an order from MongoDB by its order_id using server-side proxy
 * @param orderId The order_id to fetch
 * @returns Object with success status and order data or error message
 */
export async function getOrderFromMongoDB(orderId: string) {
  try {
    // Make the API request to our server proxy with timeout
    const response = await fetchWithTimeout(`${API_BASE_URL}?orderId=${orderId}`, {
      method: 'GET'
    }, 10000);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('MongoDB get result via proxy:', result);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Order not found'
      };
    }

    return {
      success: true,
      order: result.order
    };
  } catch (error: any) {
    console.error('Error fetching from MongoDB:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch order from MongoDB'
    };
  }
}

/**
 * Update an order's status in MongoDB using server-side proxy
 * @param orderId The order_id to update
 * @param status The new status value
 * @returns Object with success status or error message
 */
export async function updateOrderStatusInMongoDB(orderId: string, status: string) {
  try {
    // Make the API request to our server proxy with timeout
    const response = await fetchWithTimeout(`${API_BASE_URL}?orderId=${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }, 10000);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('MongoDB update result via proxy:', result);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Order not found'
      };
    }

    return {
      success: true,
      modifiedCount: result.modifiedCount
    };
  } catch (error: any) {
    console.error('Error updating in MongoDB:', error);
    return {
      success: false,
      error: error.message || 'Failed to update order in MongoDB'
    };
  }
}