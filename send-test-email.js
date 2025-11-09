// Test script to send a sample warehouse notification email
import { sendWarehouseEmail } from "./src/services/email.ts";

const testOrder = {
  id: "TEST-WAREHOUSE-" + Date.now(),
  order_id: "TEST-WAREHOUSE-" + Date.now(),
  customerName: "Sample Customer",
  guest_name: "Sample Customer",
  customerPhone: "9876543210",
  guest_phone: "9876543210",
  customerAddress: "123 Sample Street, Mumbai, Maharashtra, 400001",
  guest_address: "123 Sample Street, Mumbai, Maharashtra, 400001",
  items: [
    { name: "Sambar Powder", product_name: "Sambar Powder", qty: 2, quantity: 2 },
    { name: "Rasam Powder", product_name: "Rasam Powder", qty: 1, quantity: 1 },
    { name: "Pure Turmeric Powder", product_name: "Pure Turmeric Powder", qty: 1, quantity: 1 }
  ],
  totalPrice: 450,
  total_price: 450,
  final_amount: 450,
  paymentStatus: "Confirmed",
  payment_status: "Confirmed",
  deliveryDate: "August 20, 2025",
  delivery_date: "August 20, 2025"
};

console.log("🧪 Sending test warehouse notification email...");
console.log("📧 Test Order Details:", JSON.stringify(testOrder, null, 2));

try {
  const result = await sendWarehouseEmail(testOrder);
  
  if (result.success) {
    console.log("✅ Test email sent successfully!");
    console.log("📧 EmailJS Response:", result.result.text);
    console.log("📧 Status:", result.result.status);
    console.log("");
    console.log("🎯 Please check the warehouse email: shreeraagaswaadghar@gmail.com");
    console.log("📬 Check both inbox and spam/junk folder");
    console.log("✉️ Subject should contain the order ID:", testOrder.id);
  } else {
    console.error("❌ Failed to send test email:", result.error);
  }
} catch (error) {
  console.error("❌ Error running test:", error);
}
