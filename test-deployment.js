// Test script to verify Vercel deployment is working
import fetch from 'node-fetch';

const VERCEL_URL = 'https://shreeraga-main-3w9e8h60i-manis-projects-3c91d416.vercel.app';

async function testDeployment() {
  console.log('🧪 Testing Vercel Deployment...\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing API Health Check...');
    const healthResponse = await fetch(`${VERCEL_URL}/api`);
    const healthData = await healthResponse.json();
    console.log('✅ API Health:', healthData.message);
    
    // Test 2: Test Orders API
    console.log('\n2. Testing Orders API...');
    const ordersResponse = await fetch(`${VERCEL_URL}/api/orders`);
    const ordersData = await ordersResponse.json();
    console.log('✅ Orders API:', `${ordersData.count} orders found`);
    
    // Test 3: Create Test Order
    console.log('\n3. Testing Order Creation...');
    const testOrder = {
      guest_name: 'Test Customer',
      guest_phone: '9876543210',
      guest_address: '123 Test Street, Test City',
      items: [
        { name: 'Test Product', qty: 1, price: 100 }
      ],
      total_price: 100
    };
    
    const createResponse = await fetch(`${VERCEL_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    
    const createData = await createResponse.json();
    if (createData.success) {
      console.log('✅ Order Created:', createData.order.order_id);
    } else {
      console.log('❌ Order Creation Failed:', createData.message);
    }
    
    console.log('\n🎉 Deployment Test Complete!');
    console.log(`\n🌐 Your app is live at: ${VERCEL_URL}`);
    console.log('📋 Next step: Configure custom domain in Vercel dashboard');
    
  } catch (error) {
    console.error('❌ Deployment Test Failed:', error.message);
  }
}

testDeployment();
