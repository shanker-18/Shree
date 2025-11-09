# Order System Setup Guide

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/raagaswaad
EMAILJS_SERVICE_ID=service_lfndsjx
EMAILJS_TEMPLATE_WAREHOUSE=template_xdvaj0r
EMAILJS_PUBLIC_KEY=Ds8BSCMR3zFiyYo33
EMAILJS_PRIVATE_KEY=2BZ03C31THQVPGhLEbrnl
```

## MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `raagaswaad`
3. The Order collection will be created automatically

## EmailJS Template

The warehouse email template should contain:

```
Hello Warehouse Team,

A new order has been placed. Please prepare it for dispatch.

Order Details:
Order ID: {{order_id}}

Customer Name: {{customer_name}}

Customer Phone: {{customer_phone}}

Delivery Address: {{delivery_address}}

Order Items:
{{order_items}}

Total Amount: ₹{{total_price}}

Payment Status: {{payment_status}}

Expected Delivery Date: {{delivery_date}}

Best Regards,
Shree Raaga Order System
```

## Running the Application

1. Install dependencies: `npm install`
2. Start the backend: `npm run server`
3. Start the frontend: `npm run dev`

## API Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get specific order
- `PATCH /api/orders/:orderId/status` - Update order status

## Order Flow

1. User fills order details on frontend
2. Clicks "Place Order" button
3. Frontend sends order data to backend API
4. Backend saves order to MongoDB
5. Backend sends email to warehouse using EmailJS
6. User sees success confirmation
