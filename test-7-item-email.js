// Test script to verify email with 7 sample products
import { sendWarehouseEmail } from './src/services/email.ts';

// Sample order with 7 products (50g samples)
const testOrder = {
  id: 'TEST-SAMPLE-' + Date.now(),
  customerName: 'Manian VJS',
  customerPhone: '8870636994',
  customerAddress: '185, East Colony, Lakshmi Puram, Kovilpatti, Tamil Nadu - 628502',
  items: [
    { name: 'Turmeric Powder - 50g Sample', qty: 1, price: 0 },
    { name: 'Idly Powder - 50g Sample', qty: 1, price: 0 },
    { name: 'Rasam Powder - 50g Sample', qty: 1, price: 0 },
    { name: 'Sambar Powder - 50g Sample', qty: 1, price: 0 },
    { name: 'Milagu Powder - 50g Sample', qty: 1, price: 0 },
    { name: 'Jeera Powder - 50g Sample', qty: 1, price: 0 },
    { name: 'Malli Powder - 50g Sample', qty: 1, price: 0 }
  ],
  totalPrice: 0,
  paymentStatus: 'confirmed',
  deliveryDate: '3-5 business days'
};

async function testSevenItemEmail() {
  try {
    console.log('🧪 Testing email with 7 sample products...');
    console.log('📋 Test Order:');
    console.log(`   Order ID: ${testOrder.id}`);
    console.log(`   Customer: ${testOrder.customerName}`);
    console.log(`   Phone: ${testOrder.customerPhone}`);
    console.log(`   Items: ${testOrder.items.length} items`);
    console.log('   Product List:');
    testOrder.items.forEach((item, index) => {
      console.log(`     ${index + 1}. ${item.name} x ${item.qty}`);
    });
    console.log('');
    
    console.log('📧 Sending test email...');
    await sendWarehouseEmail(testOrder);
    console.log('✅ Test completed! Check your email inbox.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSevenItemEmail();
