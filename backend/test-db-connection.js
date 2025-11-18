import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testOrder = {
  order_id: `TEST-${Date.now()}`,
  guest_name: "Test Customer",
  guest_phone: "+91 9876543210",
  guest_address: "123 Test Street, Test City, 123456",
  items: [
    { name: "Test Product 1", qty: 2, price: 500 },
    { name: "Test Product 2", qty: 1, price: 1000 }
  ],
  total_price: 2000,
  payment_status: "confirmed",
  delivery_date: "3-5 business days",
  status: "pending"
};

async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing MongoDB connection...");
    console.log("Database URI:", process.env.MONGODB_URI ? "✅ Set" : "❌ Missing");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
    
    // Test creating an order
    console.log("📝 Testing order creation...");
    
    // Import the Order model
    const { default: Order } = await import('./models/Order.js');
    
    // Create a test order
    const order = await Order.create(testOrder);
    console.log("✅ Test order created successfully");
    console.log("📋 Order ID:", order.order_id);
    console.log("📋 MongoDB ID:", order._id);
    
    // Fetch the order to verify it was saved
    const savedOrder = await Order.findOne({ order_id: testOrder.order_id });
    console.log("✅ Order retrieved from database");
    console.log("📊 Order details:", JSON.stringify(savedOrder, null, 2));
    
    // Clean up - delete the test order
    await Order.deleteOne({ order_id: testOrder.order_id });
    console.log("🧹 Test order cleaned up");
    
    console.log("🎉 Database test completed successfully!");
    
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("Full error:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the test
testDatabaseConnection();
