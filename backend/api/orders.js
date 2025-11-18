import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://vxlldtzcedpmwxwszpvk.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bGxkdHpjZWRwbXd4d3N6cHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDA2MjEsImV4cCI6MjA3MTQxNjYyMX0.KxOz_sGQAg5fECqHZpzsD0QUFwa4GCFxXGIs00hDU6Y';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In-memory storage fallback
let inMemoryOrders = [];

// Function to connect to Supabase (just a health check)
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log("⚠️ Supabase connection test failed:", error.message);
      return false;
    }
    
    console.log("✅ Supabase connected successfully");
    return true;
  } catch (error) {
    console.log("⚠️ Supabase connection failed, will use in-memory storage");
    console.error("Supabase Error:", error.message);
    return false;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseConnected = await testSupabaseConnection();

  try {
    if (req.method === 'GET') {
      // GET all orders or specific order
      const { orderId } = req.query;
      
      if (orderId) {
        // Get specific order
        let order = null;
        
        if (supabaseConnected) {
          try {
            const { data, error } = await supabase
              .from('orders')
              .select('*')
              .eq('order_id', orderId)
              .single();
              
            if (error) {
              throw error;
            }
            
            order = data;
            console.log("✅ Order retrieved from Supabase");
          } catch (supabaseError) {
            console.log("⚠️ Supabase query failed, using in-memory storage");
            order = inMemoryOrders.find(o => o.order_id === orderId);
          }
        } else {
          order = inMemoryOrders.find(o => o.order_id === orderId);
          console.log("✅ Order retrieved from in-memory storage");
        }
        
        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Order not found'
          });
        }
        
        return res.status(200).json({
          success: true,
          order: order
        });
      } else {
        // Get all orders
        let orders = [];
        
        if (supabaseConnected) {
          try {
            const { data, error } = await supabase
              .from('orders')
              .select('*')
              .order('created_at', { ascending: false });
              
            if (error) {
              throw error;
            }
            
            orders = data || [];
            console.log("✅ Orders retrieved from Supabase");
          } catch (supabaseError) {
            console.log("⚠️ Supabase query failed, using in-memory storage");
            orders = [...inMemoryOrders].sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
          }
        } else {
          orders = [...inMemoryOrders].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          console.log("✅ Orders retrieved from in-memory storage");
        }
        
        return res.status(200).json({
          success: true,
          count: orders.length,
          orders: orders
        });
      }
    } 
    
    else if (req.method === 'POST') {
      // Create new order
      const orderData = req.body;
      
      // Generate order_id if not provided
      if (!orderData.order_id) {
        orderData.order_id = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
      
      console.log("📝 Creating order with ID:", orderData.order_id);
      
      let order;
      
      if (supabaseConnected) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single();
            
          if (error) {
            throw error;
          }
          
          order = data;
          console.log("✅ Order saved to Supabase successfully");
        } catch (supabaseError) {
          console.log("⚠️ Supabase save failed, using in-memory storage");
          console.error("Supabase Error:", supabaseError.message);
          // Fallback to in-memory storage
          order = {
            ...orderData,
            id: uuidv4(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          inMemoryOrders.push(order);
          console.log("✅ Order saved to in-memory storage");
        }
      } else {
        // Use in-memory storage
        order = {
          ...orderData,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        inMemoryOrders.push(order);
        console.log("✅ Order saved to in-memory storage");
      }
      
      return res.status(201).json({
        success: true,
        order
      });
    } 
    
    else if (req.method === 'PATCH') {
      // Update order status
      const { orderId } = req.query;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      let result = null;
      
      if (supabaseConnected) {
        try {
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
            throw error;
          }
          
          result = data;
          console.log("✅ Order updated in Supabase");
        } catch (supabaseError) {
          console.log("⚠️ Supabase update failed, using in-memory storage");
          // Fallback to in-memory storage
          const orderIndex = inMemoryOrders.findIndex(o => o.order_id === orderId);
          if (orderIndex !== -1) {
            inMemoryOrders[orderIndex].status = status;
            inMemoryOrders[orderIndex].updated_at = new Date().toISOString();
            result = inMemoryOrders[orderIndex];
          }
        }
      } else {
        // Use in-memory storage
        const orderIndex = inMemoryOrders.findIndex(o => o.order_id === orderId);
        if (orderIndex !== -1) {
          inMemoryOrders[orderIndex].status = status;
          inMemoryOrders[orderIndex].updated_at = new Date().toISOString();
          result = inMemoryOrders[orderIndex];
          console.log("✅ Order updated in in-memory storage");
        }
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message: `Order with ID ${orderId} not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order: result
      });
    } 
    
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error'
    });
  }
}
