import emailjs from "@emailjs/browser";

// Test function to send a sample email
export const testEmailJS = async () => {
  try {
    console.log("🧪 Testing EmailJS with sample data...");
    
    const sampleOrder = {
      id: "TEST-ORDER-123",
      customerName: "Test Customer",
      customerPhone: "+91 9876543210",
      customerAddress: "123 Test Street, Test City, 123456",
      items: [
        { name: "Test Product 1", qty: 2 },
        { name: "Test Product 2", qty: 1 }
      ],
      totalPrice: "₹1500",
      paymentStatus: "Paid",
      deliveryDate: "2024-01-15"
    };

    await sendWarehouseEmail(sampleOrder);
    console.log("✅ Test email sent successfully!");
  } catch (err) {
    console.error("❌ Test email failed:", err);
  }
};

export const sendWarehouseEmail = async (order: any) => {
  try {
    // Debug: Log EmailJS configuration
    console.log("🔍 EmailJS Configuration:");
    console.log("Service ID: service_lfndsjx");
    console.log("Template ID: template_xdvaj0r");
    console.log("Public Key: _PAsQMMBy-RHc5NZL ✅ Set");
    
    // Debug: Log the order data received
    console.log("📋 Order data received:", JSON.stringify(order, null, 2));
    
    // Ensure we have items array
    if (!order.items || !Array.isArray(order.items)) {
      console.error("❌ Order items is missing or not an array:", order.items);
      throw new Error("Order items is missing or not an array");
    }
    
    console.log("🧪 Processing items:", order.items);
    
    // Format order items - OPTIMIZED for EmailJS limits
    let orderItemsFormatted = order.items.map((i: any, index: number) => {
      let name = i.name || i.product_name || 'Unknown Product';
      
      // Shorten long product names to avoid EmailJS limits
      if (name.includes(' - 50g Sample')) {
        name = name.replace(' - 50g Sample', ' (50g)');
      }
      if (name.includes('Powder')) {
        name = name.replace(' Powder', '');
      }
      
      // Keep it concise for EmailJS
      if (name.length > 25) {
        name = name.substring(0, 22) + '...';
      }
      
      const qty = i.qty || i.quantity || 1;
      const result = `- ${name} x${qty}`; // Remove space to save characters
      console.log(`  Item ${index + 1}: ${result}`);
      return result;
    }).join("\n");
    
    console.log(`📏 Total order_items length: ${orderItemsFormatted.length} characters`);
    
    // Check if we're hitting EmailJS limits (typically around 500-1000 chars per field)
    if (orderItemsFormatted.length > 800) {
      console.warn(`⚠️ order_items is very long (${orderItemsFormatted.length} chars), may hit EmailJS limits`);
      
      // Create a shorter version if needed
      const shortVersion = order.items.map((i: any, index: number) => {
        let name = i.name || i.product_name || `Item ${index + 1}`;
        if (name.includes(' - 50g Sample')) name = name.replace(' - 50g Sample', '');
        if (name.includes(' Powder')) name = name.replace(' Powder', '');
        if (name.length > 15) name = name.substring(0, 12) + '...';
        const qty = i.qty || i.quantity || 1;
        return `- ${name} x${qty}`;
      }).join("\n");
      
      console.log(`📏 Using shorter version: ${shortVersion.length} characters`);
      console.log(`📦 Short version content:\n${shortVersion}`);
      
      // Use the shorter version if it's significantly smaller
      if (shortVersion.length < orderItemsFormatted.length * 0.7) {
        console.log("✂️ Using shortened product names to avoid EmailJS limits");
        // Update the main variable instead of returning
        orderItemsFormatted = shortVersion;
      }
    }
    
    // EMERGENCY: If order_items is still empty, force it
    if (!orderItemsFormatted || orderItemsFormatted.length < 5) {
      console.error("❌ EMERGENCY: order_items is empty or invalid:", orderItemsFormatted);
      console.error("❌ Original items:", order.items);
      throw new Error(`Order items formatting failed. Original: ${JSON.stringify(order.items)}`);
    }
    
    // Also create HTML version with <br> tags in case template needs it
    const orderItemsHTML = order.items.map((i: any) => {
      const name = i.name || i.product_name || 'Unknown Product';
      const qty = i.qty || i.quantity || 1;
      return `- ${name} x ${qty}`;
    }).join("<br>\n");
    
    // Separate items into samples and regular products for additional fields
    const regularItems = order.items.filter((i: any) => (i.price || 0) > 0);
    const sampleItems = order.items.filter((i: any) => (i.price || 0) === 0 || (i.name && i.name.includes('Sample')));
    
    const regularItemsFormatted = regularItems.map((i: any) => {
      const name = i.name || i.product_name || 'Unknown Product';
      const qty = i.qty || i.quantity || 1;
      const price = i.price || 0;
      return `- ${name} x ${qty} (₹${price} each)`;
    }).join("\n") || "None";
    
    const sampleItemsFormatted = sampleItems.map((i: any) => {
      const name = i.name || i.product_name || 'Unknown Product';
      const qty = i.qty || i.quantity || 1;
      return `- ${name} x ${qty} (Free Sample)`;
    }).join("\n") || "None";
    
    // Debug: Log formatted items
    console.log("📦 Order items formatted:", orderItemsFormatted);
    console.log("💰 Regular items formatted:", regularItemsFormatted);
    console.log("🆓 Sample items formatted:", sampleItemsFormatted);
    
    // Email parameters - using EXACT same format as working test
    // Try multiple parameter names to ensure EmailJS template receives data
    const emailParams = {
      // Primary fields
      order_id: order.id || order.order_id || 'NO-ID',
      customer_name: order.customerName || order.guest_name || 'Unknown Customer', 
      customer_phone: order.customerPhone || order.guest_phone || 'No Phone',
      delivery_address: order.customerAddress || order.guest_address || 'No Address',
      order_items: orderItemsFormatted, // Main field - matches test-emailjs.js format
      total_price: order.totalPrice || order.total_price || order.final_amount || 0,
      payment_status: order.paymentStatus || order.payment_status || 'Confirmed',
      delivery_date: order.deliveryDate || order.delivery_date || '3-5 business days',
      
      // Additional fields for EmailJS template flexibility
      regular_items: regularItemsFormatted, // Separated regular items
      sample_items: sampleItemsFormatted, // Separated sample items
      
      // Alternative field names in case template uses different naming
      orderItems: orderItemsFormatted,
      order_details: orderItemsFormatted,
      items: orderItemsFormatted,
      product_list: orderItemsFormatted,
      item_details: orderItemsFormatted,
      
      // Ensure we don't have any empty/undefined values that could cause issues
      ...(orderItemsFormatted && { confirmed_order_items: orderItemsFormatted }),
    };
    
    // Debug: Log email parameters being sent
    console.log("📧 Final email parameters:", JSON.stringify(emailParams, null, 2));
    
    // Show exactly what will appear in the email
    console.log("📝 Email content preview:");
    console.log("Order ID:", emailParams.order_id);
    console.log("Customer Name:", emailParams.customer_name);
    console.log("Customer Phone:", emailParams.customer_phone);
    console.log("Delivery Address:", emailParams.delivery_address);
    console.log("Order Items:");
    console.log(emailParams.order_items);
    console.log("Total Amount: ₹" + emailParams.total_price);
    console.log("Payment Status:", emailParams.payment_status);
    console.log("Expected Delivery Date:", emailParams.delivery_date);
    
    const result = await emailjs.send(
      "service_lfndsjx",
      "template_xdvaj0r",
      emailParams,
      "_PAsQMMBy-RHc5NZL"
    );
    
    console.log("✅ Warehouse email sent successfully!");
    console.log("📧 EmailJS Response Status:", result.status);
    console.log("📧 EmailJS Response Text:", result.text);
    
    return { success: true, result };
    
  } catch (err) {
    console.error("❌ Error sending warehouse email:", err);
    
    // Log comprehensive error information
    if (err instanceof Error) {
      console.error("❌ Error name:", err.name);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error stack:", err.stack);
    }
    
    // Log EmailJS specific error details
    if (typeof err === 'object' && err !== null) {
      console.error("❌ Error details:", JSON.stringify(err, null, 2));
    }
    
    return { success: false, error: err };
  }
};
