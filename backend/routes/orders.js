import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import twilio from 'twilio';

// Ensure environment variables are loaded
dotenv.config();

// In-memory storage fallback (will be removed once Supabase is configured)
let inMemoryOrders = [];

const router = express.Router();

// Supabase client initialization (will be configured after setup)
let supabase = null;

// Track if Supabase is available
let supabaseAvailable = false;

// Initialize Supabase client if credentials are available
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false
      },
      realtime: {
        enabled: false // Disable realtime to avoid connection issues
      }
    });
    console.log('✅ Supabase client initialized');
    console.log('🔗 Supabase URL:', process.env.SUPABASE_URL);
    supabaseAvailable = true;
    
    console.log('📝 Supabase connection will be tested on first request');
  } catch (initError) {
    console.log('❌ Failed to initialize Supabase client:', initError.message);
    supabase = null;
    supabaseAvailable = false;
  }
} else {
  console.log('⚠️  Supabase credentials not found, using in-memory storage');
  supabaseAvailable = false;
}

// Helper function to safely execute Supabase operations
const safeSupabaseOperation = async (operation, fallbackValue = null) => {
  if (!supabase || !supabaseAvailable) {
    return { data: fallbackValue, error: { message: 'Supabase not available' } };
  }
  
  try {
    const result = await operation(supabase);
    return result;
  } catch (error) {
    console.log('❌ Supabase operation failed:', error.message);
    console.log('❌ Error type:', error.constructor.name);
    console.log('❌ Error code:', error.code);
    console.log('❌ Full error:', error);
    console.log('🔄 Switching to in-memory storage for this session');
    supabaseAvailable = false; // Disable Supabase for this session
    return { data: fallbackValue, error: error };
  }
};

// Helper to send WhatsApp order notification to warehouse via Twilio template
const sendWarehouseWhatsApp = async (order) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+1XXXXXXXXXX
    const warehouseNumber = process.env.WAREHOUSE_WHATSAPP; // e.g. +91XXXXXXXXXX (without whatsapp:)
    const templateSid = process.env.TWILIO_WHATSAPP_WAREHOUSE_TEMPLATE_SID; // Twilio Content SID for the template

    if (!accountSid || !authToken || !from || !warehouseNumber || !templateSid) {
      console.log('⚠️  Skipping warehouse WhatsApp send - missing Twilio env vars');
      return;
    }

    const client = twilio(accountSid, authToken);

    // Ensure "to" is in whatsapp:+E.164 format
    const to = warehouseNumber.startsWith('whatsapp:')
      ? warehouseNumber
      : `whatsapp:${warehouseNumber.startsWith('+') ? warehouseNumber : `+${warehouseNumber}`}`;

    const items = Array.isArray(order.items) ? order.items : [];
    const itemsText = items
      .map((item, index) => {
        const name = item.name || item.product_name || 'Item';
        const qty = item.qty || item.quantity || 1;
        const price = item.price != null ? ` - ₹${item.price}` : '';
        return `${index + 1}. ${name} x${qty}${price}`;
      })
      .join('\n');

    const orderId = order.order_id || order.id;
    const customerName = order.guest_name || order.customer_name || '';
    const customerPhone = order.guest_phone || order.customer_phone || '';
    const customerAddress = order.guest_address || order.customer_address || '';
    const totalAmount = order.total_price ?? order.total_amount ?? order.final_amount ?? '';
    const paymentStatus = order.payment_status || 'Confirmed';
    const deliveryDate = order.delivery_date || '3-5 business days';

    const contentVariables = {
      1: String(orderId || ''),
      2: String(customerName || ''),
      3: String(customerPhone || ''),
      4: String(customerAddress || ''),
      5: String(itemsText || ''),
      6: String(totalAmount || ''),
      7: String(paymentStatus || ''),
      8: String(deliveryDate || ''),
    };

    console.log('📲 Sending warehouse WhatsApp via Twilio template with variables:', contentVariables);

    const message = await client.messages.create({
      from,
      to,
      contentSid: templateSid,
      contentVariables: JSON.stringify(contentVariables),
    });

    console.log('✅ Warehouse WhatsApp sent. SID:', message.sid);
  } catch (err) {
    console.error('❌ Failed to send warehouse WhatsApp notification:', err?.message || err);
  }
};

// Create new order
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;
    
    // Generate order_id if not provided
    if (!orderData.order_id) {
      const ts = Date.now().toString(36).toUpperCase();
      const rand = Math.random().toString(36).substr(2, 4).toUpperCase();
      orderData.order_id = `RG-${ts}-${rand}`;
    }
    
    // Add timestamps
    orderData.created_at = new Date().toISOString();
    orderData.updated_at = new Date().toISOString();
    
    console.log("📝 Creating order with ID:", orderData.order_id);
    console.log("📊 Order data:", JSON.stringify(orderData, null, 2));

    let order;
    
    // Try Supabase first, with automatic fallback
    const { data, error } = await safeSupabaseOperation(async (supabase) => {
      return await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
    });
    
    if (data && !error) {
      // Supabase success
      order = data;
      console.log("✅ Order saved to Supabase successfully");
      console.log("📋 Supabase Order ID:", order.id);
    } else {
      // Fallback to in-memory storage
      order = {
        ...orderData,
        id: uuidv4()
      };
      inMemoryOrders.push(order);
      console.log("✅ Order saved to in-memory storage");
      if (error) {
        console.log("🔄 Fell back due to:", error.message);
      }
    }

    // Fire-and-forget warehouse WhatsApp notification (does not block order creation)
    sendWarehouseWhatsApp(order);

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Retrieve all orders
router.get('/', async (req, res) => {
  try {
    let orders = [];
    
    // Try Supabase first, with automatic fallback
    const { data, error } = await safeSupabaseOperation(async (supabase) => {
      return await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
    }, []);
    
    if (data && !error) {
      // Supabase success
      orders = data || [];
      console.log("✅ Orders retrieved from Supabase");
    } else {
      // Fallback to in-memory storage
      orders = [...inMemoryOrders].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      console.log("✅ Orders retrieved from in-memory storage");
      if (error) {
        console.log("🔄 Fell back due to:", error.message);
      }
    }
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    // Even if there's an error, return empty array instead of 500
    res.status(200).json({
      success: true,
      count: 0,
      orders: [],
      message: 'Using fallback storage'
    });
  }
});

// GET - Retrieve a specific order by order_id
router.get('/:orderId', async (req, res) => {
  try {
    let order = null;
    
    if (supabase) {
      // Get from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', req.params.orderId)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      order = data;
      if (order) console.log("✅ Order retrieved from Supabase");
    } else {
      // Fallback to in-memory storage
      order = inMemoryOrders.find(o => o.order_id === req.params.orderId);
      if (order) console.log("✅ Order retrieved from in-memory storage");
    }
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH - Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    let result = null;

    if (supabase) {
      // Update in Supabase
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId)
        .select()
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            message: `Order with ID ${orderId} not found`
          });
        }
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      result = data;
    } else {
      // Update in in-memory storage
      const orderIndex = inMemoryOrders.findIndex(o => o.order_id === orderId);
      if (orderIndex === -1) {
        return res.status(404).json({
          success: false,
          message: `Order with ID ${orderId} not found`
        });
      }
      
      inMemoryOrders[orderIndex].status = status;
      inMemoryOrders[orderIndex].updated_at = new Date().toISOString();
      result = inMemoryOrders[orderIndex];
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: result
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update order status'
    });
  }
});

export default router;
