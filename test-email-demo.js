// Demo script to test email functionality
import fetch from 'node-fetch';

const testOrder = {
  order_id: 'DEMO-' + Date.now(),
  user_id: null,
  guest_name: 'John Doe',
  guest_phone: '9876543210',
  guest_address: '123 Main Street, Mumbai, Maharashtra, 400001',
  guest_email: 'customer@example.com',
  items: [
    {
      name: 'Sambar Powder',
      qty: 2,
      price: 150
    },
    {
      name: 'Rasam Powder',
      qty: 1,
      price: 120
    },
    {
      name: 'Pure Turmeric Powder',
      qty: 3,
      price: 80
    }
  ],
  total_price: 590,
  payment_status: 'confirmed',
  delivery_date: '3-5 business days'
};

async function testEmailDemo() {
  try {
    console.log('🧪 Testing order creation with email notification...');
    console.log('📋 Order Details:');
    console.log(`   Order ID: ${testOrder.order_id}`);
    console.log(`   Customer: ${testOrder.guest_name}`);
    console.log(`   Phone: ${testOrder.guest_phone}`);
    console.log(`   Address: ${testOrder.guest_address}`);
    console.log(`   Items: ${testOrder.items.length} items`);
    console.log(`   Total: ₹${testOrder.total_price}`);
    console.log('');
    
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
      console.log('📧 Email Result:', result.emailResult);
      console.log('🆔 Order ID:', result.order.order_id);
      
      // Display what the email would look like
      console.log('\n📧 Email Content Preview:');
      console.log('═'.repeat(60));
      console.log('Subject: 📦 New Order for Processing');
      console.log('To: shreeraagaswaadghar@gmail.com');
      console.log('');
      
      const orderItemsText = testOrder.items.map(item => `${item.name} (Qty: ${item.qty})`).join('\n');
      
      const emailContent = `📦 New Order for Processing

Hello Warehouse Team,

A new order has been placed. Please prepare it for dispatch.

Order Details:
Order ID: ${testOrder.order_id}

Customer Name: ${testOrder.guest_name}

Customer Phone: ${testOrder.guest_phone}

Delivery Address: ${testOrder.guest_address}

Order Items:

${orderItemsText}

Total Amount: ₹${testOrder.total_price}

Payment Status: ${testOrder.payment_status}

Expected Delivery Date: ${testOrder.delivery_date}

Best Regards,
Shree Raaga Order System

Automated Email – Please do not reply`;

      console.log(emailContent);
      console.log('═'.repeat(60));
      
    } else {
      console.log('❌ Failed to create order:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the demo
console.log('🚀 Starting Email Demo Test...\n');
testEmailDemo();
