# 🚀 Complete Supabase Setup Guide

## ✅ Credentials Configured
Your Supabase credentials have been added to `.env`:
- **Project URL**: `https://vxlldtzcedpmwxwszpvk.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ✅

## 📊 Step 1: Create Orders Table in Supabase

### Method 1: Using SQL Editor (Recommended)
1. Go to your Supabase dashboard: https://vxlldtzcedpmwxwszpvk.supabase.co
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the entire content from `supabase-orders-table.sql`
5. Click **"Run"** button
6. You should see ✅ Success messages

### Method 2: Using Table Editor (Manual)
If you prefer the visual interface:

1. Go to **"Table Editor"** in left sidebar
2. Click **"Create a new table"**
3. **Table name**: `orders`
4. **Enable RLS**: ✅ Check this
5. Add columns one by one:

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| `id` | `int8` | Auto | Primary, Identity |
| `order_id` | `text` | - | Unique, Not null |
| `user_id` | `text` | `NULL` | Nullable |
| `guest_name` | `text` | - | Not null |
| `guest_phone` | `text` | - | Not null |
| `guest_address` | `text` | - | Not null |
| `items` | `jsonb` | `[]` | Not null |
| `total_price` | `numeric` | `0` | Not null |
| `payment_status` | `text` | `'pending'` | Not null |
| `delivery_date` | `text` | `'3-5 business days'` | Not null |
| `status` | `text` | `'pending'` | Not null |
| `created_at` | `timestamptz` | `now()` | Not null |
| `updated_at` | `timestamptz` | `now()` | Not null |

6. Click **"Save"**

## 🧪 Step 2: Test Connection

### Start Your Server
```bash
npm run server
```

**Expected Output:**
```
🚀 Starting ShreeRaagaSWAADGHAR API server...
✅ Supabase client initialized
Environment: development
Server running on port 5001
API available at http://localhost:5001/api/orders
```

If you see "⚠️ Supabase credentials not found", restart your terminal and try again.

## 📝 Step 3: Test with Sample Data

### Option 1: Using Our Test Script
```bash
npm run test:api
```

### Option 2: Manual Test with PowerShell
```powershell
# Test creating an order
$body = @{
    guest_name = "Test Customer"
    guest_phone = "+91-9876543210"
    guest_address = "123 Test Street, Bangalore, Karnataka"
    items = @(
        @{ name = "Butter Chicken"; qty = 1; price = 320 },
        @{ name = "Naan"; qty = 2; price = 60 }
    )
    total_price = 380
    payment_status = "confirmed"
    delivery_date = "2025-01-25"
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://localhost:5001/api/orders" -Method POST -Body $body -ContentType "application/json"
```

### Option 3: Using curl
```bash
curl -X POST http://localhost:5001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "guest_name": "Test Customer",
    "guest_phone": "+91-9876543210", 
    "guest_address": "123 Test Street, Bangalore, Karnataka",
    "items": [
      {"name": "Butter Chicken", "qty": 1, "price": 320},
      {"name": "Naan", "qty": 2, "price": 60}
    ],
    "total_price": 380,
    "payment_status": "confirmed",
    "delivery_date": "2025-01-25"
  }'
```

## ✅ Step 4: Verify Data in Supabase

1. Go to **"Table Editor"** in Supabase dashboard
2. Click on **"orders"** table
3. You should see your test order data
4. Check that all fields are populated correctly

## 🔍 API Endpoints Available

### Create Order
- **POST** `/api/orders`
- **Body**: Order data (JSON)
- **Response**: Created order with generated `order_id`

### Get All Orders  
- **GET** `/api/orders`
- **Response**: Array of all orders

### Get Single Order
- **GET** `/api/orders/{order_id}`
- **Response**: Single order by order_id

### Update Order Status
- **PATCH** `/api/orders/{order_id}/status`
- **Body**: `{"status": "confirmed"}`
- **Response**: Updated order

## 📊 Expected Data Structure

Your orders will look like this in Supabase:

```json
{
  "id": 1,
  "order_id": "ORDER-1737530123456-ABC123DEF",
  "user_id": null,
  "guest_name": "Test Customer", 
  "guest_phone": "+91-9876543210",
  "guest_address": "123 Test Street, Bangalore, Karnataka",
  "items": [
    {
      "name": "Butter Chicken",
      "qty": 1,
      "price": 320
    },
    {
      "name": "Naan", 
      "qty": 2,
      "price": 60
    }
  ],
  "total_price": 380,
  "payment_status": "confirmed",
  "delivery_date": "2025-01-25",
  "status": "pending",
  "created_at": "2025-01-22T05:49:30.000Z",
  "updated_at": "2025-01-22T05:49:30.000Z"
}
```

## 🚨 Troubleshooting

### Server Issues
- **"Supabase credentials not found"**: Restart terminal, check `.env` file
- **"Connection failed"**: Check internet connection and Supabase URL

### Database Issues  
- **"Table doesn't exist"**: Run the SQL script in Supabase SQL Editor
- **"Permission denied"**: Make sure RLS policies are created (included in SQL script)

### API Issues
- **404 errors**: Make sure server is running on port 5001
- **500 errors**: Check server console for detailed error messages

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Server starts with "Supabase client initialized"
2. ✅ API test returns success response with order data
3. ✅ Data appears in Supabase Table Editor
4. ✅ Order ID is auto-generated (e.g., "ORDER-1737530123456-ABC123DEF")
5. ✅ Timestamps are automatically set

## 🔄 Next Steps

Once everything is working:

1. Test all CRUD operations (Create, Read, Update, Delete)
2. Integrate with your frontend application  
3. Configure proper RLS policies for production
4. Add any additional fields or validation as needed

---

**Need Help?** Share any error messages you encounter and I'll help troubleshoot! 🛠️
