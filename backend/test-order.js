// Test script to verify order system
import fetch from 'node-fetch';

const testOrder = {
  order_id: 'TEST-' + Date.now(),
  user_id: null,
  guest_name: 'Test Customer',
  guest_phone: '9876543210',
  guest_address: '123 Test Street, Test City, 123456',
  items: [
    {
      name: 'Test Product 1',
      qty: 2,
      price: 100
    },
    {
      name: 'Test Product 2',
      qty: 1,
      price: 150
    }
  ],
  total_price: 350,
  payment_status: 'confirmed',
  delivery_date: '3-5 business days'
};

async function testOrderCreation() {
  try {
    console.log('🧪 Testing order creation...');
    
    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Order created successfully!');
      console.log('📧 Email sent:', result.emailSent ? 'Yes' : 'No');
      console.log('🆔 Order ID:', result.order.order_id);
      
      // Test retrieving the order
      console.log('\n🧪 Testing order retrieval...');
      const getResponse = await fetch(`http://localhost:5001/api/orders/${result.order.order_id}`);
      const getResult = await getResponse.json();
      
      if (getResult.success) {
        console.log('✅ Order retrieved successfully!');
        console.log('📋 Order details:', getResult.order);
      } else {
        console.log('❌ Failed to retrieve order:', getResult.message);
      }
      
    } else {
      console.log('❌ Failed to create order:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOrderCreation();
