import { API_ENDPOINTS } from '../config/api';

// WhatsApp service configuration (no hardcoded secrets or numbers)
const normalizePhone = (v: string) => (v || '').replace(/^whatsapp:/i, '').replace(/\s+/g, '');
const TWILIO_CONFIG = {
  // These must be set via environment variables (server-side for credentials)
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '', // Server-side only – never expose in client builds
  // Client-side FROM is optional; server enforces its own FROM
  whatsappNumber: (import.meta.env.VITE_TWILIO_WHATSAPP_FROM || '').trim(), // optional on client
  warehouseNumber: normalizePhone(import.meta.env.VITE_WAREHOUSE_PHONE || ''), // e.g. +91xxxxxxxxxx
  secondaryNumber: normalizePhone(import.meta.env.VITE_SECONDARY_PHONE || ''),
  orderProcessingNumbers: (() => {
    const raw = (import.meta.env.VITE_ORDER_PROCESSING_NUMBERS || '').trim();
    if (raw) return raw.split(',').map(n => normalizePhone(n)).filter(Boolean);
    // Fall back to any provided individual numbers (still no hardcoded defaults)
    return [
      normalizePhone(import.meta.env.VITE_WAREHOUSE_PHONE || ''),
      normalizePhone(import.meta.env.VITE_SECONDARY_PHONE || '')
    ].filter(Boolean);
  })()
};

// Interface for order data
interface WhatsAppOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    name: string;
    qty: number;
    price?: number;
    weight?: string;
  }>;
  totalPrice: string | number;
  paymentStatus: string;
  deliveryDate: string;
}

// Format order details for WhatsApp message
export const formatWhatsAppMessage = (order: WhatsAppOrder): string => {
  const items = order.items.map((item, index) => {
    let itemText = `${index + 1}. ${item.name} x${item.qty}`;
    if (item.weight) {
      itemText += ` (${item.weight})`;
    }
    if (item.price && item.price > 0) {
      itemText += ` - ₹${item.price}`;
    } else {
      itemText += ' - Free Sample';
    }
    return itemText;
  }).join('\n');

  const message = `🛍️ *NEW ORDER RECEIVED*

📋 *Order Details:*
Order ID: ${order.id}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Payment: ${order.paymentStatus}
Expected Delivery: ${order.deliveryDate}

📦 *Items Ordered:*
${items}

💰 *Total Amount: ₹${order.totalPrice}*

📍 *Delivery Address:*
${order.customerAddress}

---
Please process this order and update the customer accordingly.`;

  return message;
};

// Send WhatsApp message using Twilio API (server-side)
export const sendWhatsAppToWarehouse = async (order: WhatsAppOrder) => {
  try {
    console.log('📱 Preparing to send WhatsApp message to warehouse...');

    // Only require API endpoint
    if (!API_ENDPOINTS.WHATSAPP) {
      console.warn('⚠️ WhatsApp API endpoint not configured, skipping WhatsApp notification');
      return { success: false, error: 'WhatsApp API endpoint not configured', skipped: true };
    }
    
    // Format the message
    const message = formatWhatsAppMessage(order);
    console.log('📝 WhatsApp message formatted:', message);

    // Prepare the API request payload
    const whatsappPayload: any = {
      // from is optional; server uses its own configured FROM
      body: message,
      order: order // Include order details for backend processing
    };
    // If we have a warehouse number on the client, add it; else backend will use TWILIO_WHATSAPP_TO
    if (TWILIO_CONFIG.warehouseNumber) {
      whatsappPayload.to = `whatsapp:${TWILIO_CONFIG.warehouseNumber}`;
    }

    console.log('🚀 Sending WhatsApp via backend API...');

    // Send via your backend API with timeout and error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(API_ENDPOINTS.WHATSAPP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(whatsappPayload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ WhatsApp message sent successfully:', result);
    
    return { success: true, result };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('⚠️ WhatsApp API timeout - service may be unavailable');
    } else {
      console.warn('⚠️ WhatsApp service unavailable:', error.message);
    }
    return { success: false, error: error.message, skipped: true };
  }
};

// Send WhatsApp messages to multiple numbers for order processing
export const sendWhatsAppToMultipleNumbers = async (order: WhatsAppOrder) => {
  try {
    console.log('📱 Preparing to send WhatsApp messages to multiple numbers...');

    if (!TWILIO_CONFIG.orderProcessingNumbers.length) {
      console.warn('⚠️ No order processing numbers configured. Skipping multi-recipient WhatsApp notifications.');
      return {
        success: false,
        error: 'Recipients or sender not configured',
        results: [],
        errors: [],
        summary: { total: 0, successful: 0, failed: 0 },
        skipped: true
      };
    }

    if (!API_ENDPOINTS.WHATSAPP) {
      console.warn('⚠️ WhatsApp API endpoint not configured, skipping multiple WhatsApp notifications');
      return {
        success: false,
        error: 'WhatsApp API endpoint not configured',
        results: [],
        errors: [],
        summary: { total: 0, successful: 0, failed: 0 },
        skipped: true
      };
    }
    
    // Format the message
    const message = formatWhatsAppMessage(order);
    console.log('📝 WhatsApp message formatted for multiple recipients');

    const results: Array<{ phoneNumber: string; success: boolean; result?: any; error?: string }> = [];
    const errors: Array<{ phoneNumber: string; success: boolean; error?: string }> = [];

    // Send to all order processing numbers
    for (const phoneNumber of TWILIO_CONFIG.orderProcessingNumbers) {
      try {
        console.log(`📱 Sending WhatsApp to ${phoneNumber}...`);
        
        // Prepare the API request payload for each number
        const whatsappPayload = {
          // from omitted; server uses its own configured FROM
          to: phoneNumber.startsWith('whatsapp:') ? phoneNumber : `whatsapp:${phoneNumber}`,
          body: message,
          order: order,
          recipient: phoneNumber
        };

        // Send via your backend API
        const response = await fetch(API_ENDPOINTS.WHATSAPP, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(whatsappPayload)
        });

        if (!response.ok) {
          throw new Error(`WhatsApp API error for ${phoneNumber}: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`✅ WhatsApp message sent successfully to ${phoneNumber}:`, result);
        
        results.push({ 
          phoneNumber, 
          success: true, 
          result 
        });
        
        // Add a small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error sending WhatsApp message to ${phoneNumber}:`, error);
        errors.push({ 
          phoneNumber, 
          success: false, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    const successCount = results.length;
    const totalCount = TWILIO_CONFIG.orderProcessingNumbers.length;
    
    console.log(`📊 WhatsApp delivery summary: ${successCount}/${totalCount} messages sent successfully`);
    
    return { 
      success: successCount > 0, // Success if at least one message was sent
      results,
      errors,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: errors.length
      }
    };
  } catch (error) {
    console.error('❌ Error in sendWhatsAppToMultipleNumbers:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      results: [],
      errors: [],
      summary: { total: 0, successful: 0, failed: 0 }
    };
  }
};

// Automatic WhatsApp notification using Webhook service
const sendViaWebhook = async (order: WhatsAppOrder): Promise<{ success: boolean; method: string; error?: string }> => {
  try {
    const webhookUrl = (import.meta.env.VITE_WHATSAPP_WEBHOOK_URL || '').trim();
    if (!webhookUrl) {
      console.warn('⚠️ No WhatsApp webhook URL configured. Skipping webhook send.');
      return { success: false, method: 'webhook-disabled', error: 'Webhook URL not configured' };
    }

    const message = formatWhatsAppMessage(order);
    const warehousePhone = TWILIO_CONFIG.warehouseNumber;

    const payload = {
      phone: warehousePhone,
      message: message,
      order: {
        id: order.id,
        customer: order.customerName,
        items: order.items,
        total: order.totalPrice
      }
    };
    
    console.log('📱 Sending WhatsApp via webhook service...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✅ WhatsApp webhook sent successfully');
      return { success: true, method: 'webhook' };
    } else {
      throw new Error(`Webhook error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return { success: false, method: 'webhook-error', error: error.message };
  }
};

// Alternative: Use WhatsApp Web integration as optional fallback
const sendViaWhatsAppWeb = (order: WhatsAppOrder): { success: boolean; method: string } => {
  try {
    const enableWebFallback = (import.meta.env.VITE_ENABLE_WA_WEB_FALLBACK || '').toLowerCase() === 'true';
    if (!enableWebFallback) {
      console.log('ℹ️ WhatsApp Web fallback is disabled.');
      return { success: false, method: 'web-fallback-disabled' };
    }

    const message = formatWhatsAppMessage(order);
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = TWILIO_CONFIG.warehouseNumber.replace('+', '');
    const whatsappWebUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    console.log('📱 Opening WhatsApp Web for manual sending...');
    
    // Auto-open WhatsApp Web in a new tab
    if (typeof window !== 'undefined') {
      window.open(whatsappWebUrl, '_blank');
      console.log('🚀 WhatsApp Web opened with pre-filled message');
      return { success: true, method: 'web-opened' };
    }
    
    console.log('🗺 WhatsApp Web URL generated:', whatsappWebUrl);
    return { success: true, method: 'web-generated' };
  } catch (error) {
    console.error('❌ WhatsApp Web integration error:', error);
    return { success: false, method: 'web-error' };
  }
};

// Enhanced function with automatic WhatsApp sending
export const sendOrderNotificationWhatsApp = async (order: WhatsAppOrder) => {
  console.log('📱 Starting automatic WhatsApp order notification...');
  
  // Prefer API-based sending first (backend Twilio integration)
  const multipleResult = await sendWhatsAppToMultipleNumbers(order);
  if (multipleResult.success && multipleResult.summary.successful > 0) {
    console.log(`✅ WhatsApp API notification sent successfully to ${multipleResult.summary.successful} numbers`);
    return multipleResult;
  }

  const singleResult = await sendWhatsAppToWarehouse(order);
  if (singleResult.success) {
    console.log('✅ WhatsApp API notification sent successfully (single number)');
    return { success: true, fallback: false, singleResult, multipleResult };
  }

  // Then try webhook if configured
  try {
    const webhookResult = await sendViaWebhook(order);
    if (webhookResult.success) {
      console.log('✅ WhatsApp sent automatically via webhook');
      return { success: true, method: 'webhook', webhookResult };
    }
  } catch (error) {
    console.log('⚠️ Webhook service unavailable or disabled.');
  }
  
  // Optional final fallback
  console.log('🌐 All automatic methods unavailable. Checking WhatsApp Web fallback...');
  const webResult = sendViaWhatsAppWeb(order);
  
  return {
    success: webResult.success,
    method: webResult.method,
    fallback: true,
    singleResult,
    multipleResult,
    webResult
  };
};

// Test function to verify WhatsApp integration
export const testWhatsApp = async () => {
  const testOrder: WhatsAppOrder = {
    id: 'TEST-ORDER-' + Date.now(),
    customerName: 'Test Customer',
    customerPhone: '+91 9876543210',
    customerAddress: '123 Test Street, Test City, Test State - 123456',
    items: [
      { name: 'Turmeric Powder', qty: 1, price: 150, weight: '100g' },
      { name: 'Free Sample - Red Chili Powder', qty: 1, price: 0, weight: '50g' }
    ],
    totalPrice: 150,
    paymentStatus: 'Confirmed',
    deliveryDate: '3-5 business days'
  };

  console.log('🧪 Testing WhatsApp integration...');
  return await sendWhatsAppToWarehouse(testOrder);
};
