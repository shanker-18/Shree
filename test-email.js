// Test script for email functionality
require('dotenv').config();

// Import email service
let emailService;
try {
  emailService = require('./src/services/email');
  console.log('✅ Email service imported successfully');
} catch (err) {
  console.error('❌ Email service import failed:', err.message);
  process.exit(1);
}

// Sample order data
const sampleOrder = {
  order_id: 'TEST-' + Date.now(),
  guest_name: 'Test Customer',
  guest_phone: '1234567890',
  guest_address: '123 Test Street, Test City',
  guest_email: 'test@example.com', // Add your test email here
  items: [
    { name: 'Test Product 1', qty: 2, price: 10.99 },
    { name: 'Test Product 2', qty: 1, price: 24.99 }
  ],
  total_price: 46.97,
  payment_status: 'Confirmed',
  delivery_date: '3-5 business days'
};

// Test warehouse email
async function testWarehouseEmail() {
  console.log('Testing warehouse email...');
  try {
    const result = await emailService.sendWarehouseEmail(sampleOrder);
    console.log('Warehouse email result:', result.success ? '✅ Sent' : '❌ Failed');
    if (!result.success) {
      console.error('Error:', result.error);
    }
    return result.success;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Test customer email
async function testCustomerEmail() {
  console.log('Testing customer email...');
  try {
    const result = await emailService.sendCustomerEmail(sampleOrder);
    console.log('Customer email result:', result.success ? '✅ Sent' : '❌ Failed');
    if (!result.success) {
      console.error('Error:', result.error);
    }
    return result.success;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('=== EMAIL TESTING ===');
  console.log('EmailJS Configuration:');
  console.log('- Service ID:', process.env.VITE_EMAILJS_SERVICE_ID);
  console.log('- Warehouse Template:', process.env.VITE_EMAILJS_TEMPLATE_WAREHOUSE);
  console.log('- Customer Template:', process.env.VITE_EMAILJS_TEMPLATE_CUSTOMER);
  console.log('- Public Key:', process.env.VITE_EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
  console.log('- Warehouse Email:', process.env.VITE_WAREHOUSE_EMAIL);
  console.log('\n');
  
  const warehouseResult = await testWarehouseEmail();
  console.log('\n');
  const customerResult = await testCustomerEmail();
  console.log('\n');
  
  console.log('=== TEST SUMMARY ===');
  console.log('Warehouse Email:', warehouseResult ? '✅ Success' : '❌ Failed');
  console.log('Customer Email:', customerResult ? '✅ Success' : '❌ Failed');
  console.log('\n');
  
  if (warehouseResult && customerResult) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️ Some tests failed. Please check the logs above.');
  }
}

// Execute tests
runTests().catch(err => {
  console.error('Test execution failed:', err);
});