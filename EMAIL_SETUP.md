# Email Integration Setup

## Overview
This project uses EmailJS to send two types of emails:
1. **Warehouse Notification**: Sent to the warehouse team when a new order is placed
2. **Customer Confirmation**: Sent to the customer as order confirmation (optional)

## Configuration

### Environment Variables
The following environment variables need to be set in the `.env` file:

```
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_TEMPLATE_WAREHOUSE=your_warehouse_template_id
VITE_EMAILJS_TEMPLATE_CUSTOMER=your_customer_template_id
VITE_WAREHOUSE_EMAIL=warehouse@example.com
```

### EmailJS Templates

1. **Warehouse Template**
   - Create a template in EmailJS with the following variables:
     - `order_id`
     - `customer_name`
     - `customer_phone`
     - `delivery_address`
     - `order_items`
     - `total_price`
     - `payment_status`
     - `delivery_date`

2. **Customer Template**
   - Create a template in EmailJS with the following variables:
     - `order_id`
     - `customer_name`
     - `customer_email`
     - `delivery_address`
     - `order_items`
     - `total_price`
     - `payment_status`
     - `delivery_date`

## Implementation

### Backend (server.js)
The server handles order creation and triggers email notifications:

```javascript
// API route to save order
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    // Send email notifications
    const emailResult = {
      warehouse: false,
      customer: false
    };
    
    try {
      // Send warehouse notification
      const warehouseEmailResult = await sendWarehouseEmail(order);
      emailResult.warehouse = warehouseEmailResult.success;
      
      // Send customer notification if email is provided
      if (order.guest_email) {
        const customerEmailResult = await sendCustomerEmail(order);
        emailResult.customer = customerEmailResult.success;
      }
    } catch (emailErr) {
      console.error('❌ Error sending email notifications:', emailErr);
    }
    
    res.json({ success: true, order, emailResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
```

### Frontend (OrderSummary.tsx)
The frontend sends the order to the backend and displays email status:

```typescript
// Send order directly to backend API
const response = await fetch('http://localhost:5001/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderPayload)
});

// ...

// Email is sent automatically by the backend
console.log('Email status:', result.emailResult);
if (result.emailResult) {
  console.log('Warehouse email:', result.emailResult.warehouse ? 'Sent ✅' : 'Failed ❌');
  console.log('Customer email:', result.emailResult.customer ? 'Sent ✅' : 'Failed ❌');
}
```

## Testing

### Test Script
A test script is provided to verify email functionality:

```bash
node test-email.js
```

This script will:
1. Test the warehouse email
2. Test the customer email (if configured)
3. Display a summary of the results

### Manual Testing

1. Start the backend server:
   ```bash
   node server.js
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Place a test order and check:
   - MongoDB for the saved order
   - Email inbox for the warehouse notification
   - Customer email inbox (if configured)

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Verify EmailJS credentials in `.env`
   - Check console for error messages
   - Ensure templates exist in EmailJS dashboard

2. **Template errors**
   - Verify all required variables are defined in the template
   - Check for typos in variable names

3. **CORS issues**
   - EmailJS may have CORS restrictions
   - Ensure your domain is whitelisted in EmailJS settings

### Debugging

Add more detailed logging to the email service:

```typescript
console.log('Order data:', JSON.stringify(order, null, 2));
```

Check the browser console and server logs for error messages.