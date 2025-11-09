// Test EmailJS functionality directly
import emailjs from "@emailjs/browser";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: join(__dirname, '.env') });

// Mock the import.meta.env for Node.js environment
const mockEnv = {
  VITE_EMAILJS_SERVICE_ID: process.env.VITE_EMAILJS_SERVICE_ID,
  VITE_EMAILJS_TEMPLATE_WAREHOUSE: process.env.VITE_EMAILJS_TEMPLATE_WAREHOUSE,
  VITE_EMAILJS_TEMPLATE_CUSTOMER: process.env.VITE_EMAILJS_TEMPLATE_CUSTOMER,
  VITE_EMAILJS_PUBLIC_KEY: process.env.VITE_EMAILJS_PUBLIC_KEY,
  VITE_WAREHOUSE_EMAIL: process.env.VITE_WAREHOUSE_EMAIL
};

// Debug: Print environment variables
console.log('🔍 Environment Variables Debug:');
console.log('   VITE_EMAILJS_SERVICE_ID:', process.env.VITE_EMAILJS_SERVICE_ID);
console.log('   VITE_EMAILJS_TEMPLATE_WAREHOUSE:', process.env.VITE_EMAILJS_TEMPLATE_WAREHOUSE);
console.log('   VITE_EMAILJS_TEMPLATE_CUSTOMER:', process.env.VITE_EMAILJS_TEMPLATE_CUSTOMER);
console.log('   VITE_EMAILJS_PUBLIC_KEY:', process.env.VITE_EMAILJS_PUBLIC_KEY ? '***HIDDEN***' : 'undefined');
console.log('   VITE_WAREHOUSE_EMAIL:', process.env.VITE_WAREHOUSE_EMAIL);
console.log('');

// Test order data
const testOrder = {
  id: 'EMAILJS-TEST-' + Date.now(),
  order_id: 'EMAILJS-TEST-' + Date.now(),
  customerName: 'John Doe',
  guest_name: 'John Doe',
  customerPhone: '9876543210',
  guest_phone: '9876543210',
  customerAddress: '123 Main Street, Mumbai, Maharashtra, 400001',
  guest_address: '123 Main Street, Mumbai, Maharashtra, 400001',
  guest_email: 'customer@example.com',
  items: [
    {
      name: 'Sambar Powder',
      product_name: 'Sambar Powder',
      qty: 2,
      quantity: 2,
      price: 150
    },
    {
      name: 'Rasam Powder',
      product_name: 'Rasam Powder',
      qty: 1,
      quantity: 1,
      price: 120
    },
    {
      name: 'Pure Turmeric Powder',
      product_name: 'Pure Turmeric Powder',
      qty: 3,
      quantity: 3,
      price: 80
    }
  ],
  totalPrice: 590,
  total_price: 590,
  final_amount: 590,
  paymentStatus: 'Confirmed',
  payment_status: 'Confirmed',
  deliveryDate: '3-5 business days',
  delivery_date: '3-5 business days'
};

async function testWarehouseEmail() {
  try {
    console.log('🧪 Testing EmailJS Warehouse Email...');
    console.log('📧 EmailJS Configuration:');
    console.log(`   Service ID: ${mockEnv.VITE_EMAILJS_SERVICE_ID}`);
    console.log(`   Template ID: ${mockEnv.VITE_EMAILJS_TEMPLATE_WAREHOUSE}`);
    console.log(`   Public Key: ${mockEnv.VITE_EMAILJS_PUBLIC_KEY}`);
    console.log(`   Warehouse Email: ${mockEnv.VITE_WAREHOUSE_EMAIL}`);
    console.log('');

    const templateParams = {
      order_id: testOrder.id || testOrder.order_id,
      customer_name: testOrder.customerName || testOrder.guest_name,
      customer_phone: testOrder.customerPhone || testOrder.guest_phone,
      delivery_address: testOrder.customerAddress || testOrder.guest_address,
      order_items: testOrder.items.map((i) => `- ${i.name || i.product_name} x ${i.qty || i.quantity}`).join("\n"),
      total_price: testOrder.totalPrice || testOrder.total_price || testOrder.final_amount,
      payment_status: testOrder.paymentStatus || testOrder.payment_status || 'Confirmed',
      delivery_date: testOrder.deliveryDate || testOrder.delivery_date || '3-5 business days',
    };

    console.log('📋 Template Parameters:');
    console.log(JSON.stringify(templateParams, null, 2));
    console.log('');

    const result = await emailjs.send(
      mockEnv.VITE_EMAILJS_SERVICE_ID,
      mockEnv.VITE_EMAILJS_TEMPLATE_WAREHOUSE,
      templateParams,
      mockEnv.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Warehouse email sent successfully!");
    console.log("📧 EmailJS Response:", result.text);
    console.log("📧 Status:", result.status);
    return { success: true, result };

  } catch (error) {
    console.error("❌ Error sending warehouse email:", error);
    console.error("❌ Error details:", error.text || error.message);
    return { success: false, error };
  }
}

async function testCustomerEmail() {
  try {
    console.log('\n🧪 Testing EmailJS Customer Email...');
    
    if (!testOrder.guest_email) {
      console.log("⚠️ No customer email provided, skipping customer notification");
      return { success: false, error: "No customer email provided" };
    }

    const templateParams = {
      order_id: testOrder.id || testOrder.order_id,
      customer_name: testOrder.customerName || testOrder.guest_name,
      customer_email: testOrder.guest_email,
      delivery_address: testOrder.customerAddress || testOrder.guest_address,
      order_items: testOrder.items.map((i) => `- ${i.name || i.product_name} x ${i.qty || i.quantity}`).join("\n"),
      total_price: testOrder.totalPrice || testOrder.total_price || testOrder.final_amount,
      payment_status: testOrder.paymentStatus || testOrder.payment_status || 'Confirmed',
      delivery_date: testOrder.deliveryDate || testOrder.delivery_date || '3-5 business days',
    };

    console.log('📋 Customer Template Parameters:');
    console.log(JSON.stringify(templateParams, null, 2));
    console.log('');

    const result = await emailjs.send(
      mockEnv.VITE_EMAILJS_SERVICE_ID,
      mockEnv.VITE_EMAILJS_TEMPLATE_CUSTOMER,
      templateParams,
      mockEnv.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Customer email sent successfully!");
    console.log("📧 EmailJS Response:", result.text);
    console.log("📧 Status:", result.status);
    return { success: true, result };

  } catch (error) {
    console.error("❌ Error sending customer email:", error);
    console.error("❌ Error details:", error.text || error.message);
    return { success: false, error };
  }
}

async function runEmailTests() {
  console.log('🚀 Starting EmailJS Tests...\n');
  console.log('═'.repeat(60));
  
  // Test warehouse email
  const warehouseResult = await testWarehouseEmail();
  
  console.log('═'.repeat(60));
  
  // Test customer email
  const customerResult = await testCustomerEmail();
  
  console.log('═'.repeat(60));
  console.log('\n📊 Test Results Summary:');
  console.log(`   Warehouse Email: ${warehouseResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`   Customer Email: ${customerResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (!warehouseResult.success || !customerResult.success) {
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Check if EmailJS service ID, template IDs, and public key are correct');
    console.log('   2. Verify that EmailJS templates exist in your EmailJS dashboard');
    console.log('   3. Ensure template variables match the ones being sent');
    console.log('   4. Check EmailJS dashboard for any service limitations or errors');
  }
}

// Run the tests
runEmailTests().catch(console.error);
