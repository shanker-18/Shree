# 🚀 Supabase Setup Instructions for ShreeRaga Orders

## ✅ What's Been Done
- ❌ Removed all MongoDB dependencies (mongoose, mongodb)
- ❌ Deleted MongoDB-related files and models  
- ❌ Cleaned up server.js and routes
- ✅ Updated routes to use Supabase client
- ✅ Added fallback to in-memory storage until Supabase is configured
- ✅ Ready for Supabase integration

## 📋 What You Need to Do in Supabase

### 1. Create a Supabase Account & Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub/Google/Email
4. Click "New Project"
5. Choose your organization (or create one)
6. Fill in project details:
   - **Name**: `ShreeRaga-Orders` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location (e.g., `ap-south-1` for India)
7. Click "Create new project"
8. Wait 2-3 minutes for setup to complete

### 2. Create the Orders Table
1. In your Supabase dashboard, go to **"Table Editor"** (left sidebar)
2. Click **"Create a new table"**
3. Table name: `orders`
4. **Enable Row Level Security (RLS)**: ❌ Uncheck for now (we'll configure later)
5. Add these columns by clicking "Add Column":

| Column Name | Type | Default Value | Extra Settings |
|------------|------|--------------|----------------|
| `id` | `bigint` | Auto-generated | ✅ Primary, ✅ Auto Increment |
| `order_id` | `text` | - | ✅ Unique |
| `user_id` | `text` | `NULL` | ✅ Nullable |
| `guest_name` | `text` | - | ✅ Required |
| `guest_phone` | `text` | - | ✅ Required |
| `guest_address` | `text` | - | ✅ Required |
| `items` | `json` | `[]` | ✅ Required |
| `total_price` | `numeric` | `0` | ✅ Required |
| `payment_status` | `text` | `'pending'` | ✅ Required |
| `delivery_date` | `text` | `'3-5 business days'` | ✅ Required |
| `status` | `text` | `'pending'` | ✅ Required |
| `created_at` | `timestamptz` | `now()` | ✅ Required |
| `updated_at` | `timestamptz` | `now()` | ✅ Required |

6. Click **"Save"** to create the table

### 3. Get Your Supabase Credentials
1. Go to **"Settings"** → **"API"** (left sidebar)
2. Copy these values:

**Project URL**: 
```
https://your-project-id.supabase.co
```

**anon public key**: 
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (very long key)
```

### 4. Configure Environment Variables
Update your `.env` file:

```env
# Server Configuration
PORT=5001

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-anon-key...

# Node Environment
NODE_ENV=development

# (Keep your existing EmailJS configuration)
```

## 🧪 Testing the Setup

### 1. Start Your Server
```bash
npm run server
```

You should see:
```
🚀 Starting ShreeRaagaSWAADGHAR API server...
✅ Supabase client initialized
Environment: development
Server running on port 5001
API available at http://localhost:5001/api/orders
```

### 2. Test with Sample Data
```bash
npm run test:api
```

## 📊 Sample Order Data Structure

Your orders will be stored with this structure:

```json
{
  "id": 1,
  "order_id": "ORDER-1737529543123-ABC123DEF",
  "user_id": null,
  "guest_name": "Test Customer",
  "guest_phone": "+91-9876543210",
  "guest_address": "123 Test Street, Test City, Test State 560001",
  "items": [
    {
      "name": "Butter Chicken",
      "qty": 1,
      "price": 320
    },
    {
      "name": "Garlic Naan", 
      "qty": 2,
      "price": 120
    }
  ],
  "total_price": 440,
  "payment_status": "confirmed",
  "delivery_date": "2025-01-25",
  "status": "pending",
  "created_at": "2025-01-22T05:39:18.000Z",
  "updated_at": "2025-01-22T05:39:18.000Z"
}
```

## 🔒 Security Configuration (Optional)

### Row Level Security (RLS)
Once testing is complete, you can enable RLS:

1. Go to **"Authentication"** → **"Policies"**
2. Enable RLS on the `orders` table
3. Create policies as needed for your security requirements

### API Keys
- **anon key**: Safe for client-side use
- **service_role key**: Keep secret, only use server-side

## 🚨 What Information I Need From You

Once you complete the Supabase setup, provide me with:

1. ✅ **Supabase Project URL** (from Settings → API)
2. ✅ **Supabase anon public key** (from Settings → API) 
3. ✅ Confirmation that the `orders` table is created
4. ✅ Any errors you encounter during setup

## 🎯 Next Steps After Setup

1. Update your `.env` file with Supabase credentials
2. Restart your server: `npm run server`
3. Test the API: `npm run test:api`
4. Verify data is being saved in Supabase Table Editor
5. We can then proceed with any additional configurations needed

## 💡 Helpful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [SQL Editor in Supabase](https://supabase.com/docs/guides/database)

---

**Need Help?** Share your Supabase credentials and any error messages you encounter!
