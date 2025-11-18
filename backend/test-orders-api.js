import http from 'http';

// Sample order data for testing
const sampleOrder = {
  guest_name: "Test Customer",
  guest_phone: "+91-9876543210",
  guest_address: "123 Test Street, Test City, Test State 560001",
  items: [
    { name: "Butter Chicken", qty: 1, price: 320 },
    { name: "Garlic Naan", qty: 2, price: 120 }
  ],
  total_price: 440,
  payment_status: "confirmed",
  delivery_date: "2025-01-25"
};

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testOrdersAPI() {
  console.log('🚀 Testing Orders API...');
  console.log('═'.repeat(50));
  
  const baseUrl = 'localhost';
  const port = 5001;
  
  try {
    // Test 1: Check if server is running
    console.log('\\n1️⃣  Testing server status...');
    const serverTest = await makeRequest({
      hostname: baseUrl,
      port: port,
      path: '/',
      method: 'GET',
      timeout: 5000
    });
    
    if (serverTest.status === 200) {
      console.log('✅ Server is running');
    } else {
      console.log(`❌ Server returned status: ${serverTest.status}`);
      return;
    }
    
    // Test 2: Create a new order
    console.log('\\n2️⃣  Testing order creation (POST /api/orders)...');
    const createResponse = await makeRequest({
      hostname: baseUrl,
      port: port,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    }, sampleOrder);
    
    console.log(`Status: ${createResponse.status}`);
    if (createResponse.data.success) {
      console.log('✅ Order created successfully!');
      console.log(`📋 Order ID: ${createResponse.data.order.order_id}`);
      console.log(`👤 Customer: ${createResponse.data.order.guest_name}`);
      console.log(`💰 Total: ₹${createResponse.data.order.total_price}`);
      
      const orderId = createResponse.data.order.order_id;
      
      // Test 3: Retrieve the created order
      console.log('\\n3️⃣  Testing order retrieval (GET /api/orders/:id)...');
      const getResponse = await makeRequest({
        hostname: baseUrl,
        port: port,
        path: `/api/orders/${orderId}`,
        method: 'GET',
        timeout: 5000
      });
      
      if (getResponse.data.success) {
        console.log('✅ Order retrieved successfully!');
        console.log(`📋 Retrieved Order ID: ${getResponse.data.order.order_id}`);
      } else {
        console.log('❌ Failed to retrieve order:', getResponse.data.message);
      }
      
      // Test 4: Get all orders
      console.log('\\n4️⃣  Testing get all orders (GET /api/orders)...');
      const getAllResponse = await makeRequest({
        hostname: baseUrl,
        port: port,
        path: '/api/orders',
        method: 'GET',
        timeout: 5000
      });
      
      if (getAllResponse.data.success) {
        console.log('✅ All orders retrieved successfully!');
        console.log(`📊 Total orders in database: ${getAllResponse.data.count}`);
      } else {
        console.log('❌ Failed to retrieve all orders:', getAllResponse.data.message);
      }
      
    } else {
      console.log('❌ Failed to create order:', createResponse.data.message || createResponse.data);
    }
    
    console.log('\\n🎉 API Testing Complete!');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    console.log('\\n💡 Make sure the server is running with: npm run server');
  }
}

testOrdersAPI();
