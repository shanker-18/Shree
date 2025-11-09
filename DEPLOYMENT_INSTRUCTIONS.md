# 🚀 Deployment Instructions for www.shreeraagaswaadghar.com

## Prerequisites
- ✅ Vercel CLI installed (`npm install -g vercel`)
- ✅ Logged into Vercel account (`vercel login`)
- ✅ MongoDB URI: `mongodb+srv://shreeraagaswaadghar:shreeraagaswaadghar@shreeraagaswaadghar.zmnjcdo.mongodb.net/?retryWrites=true&w=majority&appName=ShreeRaagaSWAADGHAR`

---

## 🎯 Quick Deployment (Recommended)

### Option 1: Use Automated Script
```bash
# Simply double-click the deploy.bat file or run:
./deploy.bat
```

### Option 2: Manual Steps

1. **Build the project:**
   ```powershell
   npm run build
   ```

2. **Set Environment Variables in Vercel:**
   ```powershell
   # Set MongoDB URI
   vercel env add MONGODB_URI production
   # When prompted, enter:
   mongodb+srv://shreeraagaswaadghar:shreeraagaswaadghar@shreeraagaswaadghar.zmnjcdo.mongodb.net/?retryWrites=true&w=majority&appName=ShreeRaagaSWAADGHAR

   # Set Node Environment
   vercel env add NODE_ENV production
   # When prompted, enter:
   production
   ```

3. **Deploy to Production:**
   ```powershell
   vercel --prod
   ```

---

## 🌐 Alternative: Deploy via Vercel Dashboard

### Step 1: Upload via Git
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix console errors and add MongoDB integration"
   git push origin main
   ```

2. **In Vercel Dashboard:**
   - Go to your project settings
   - Click on "Environment Variables"
   - Add the following:

   | Variable | Value | Environment |
   |----------|-------|-------------|
   | `MONGODB_URI` | `mongodb+srv://shreeraagaswaadghar:shreeraagaswaadghar@shreeraagaswaadghar.zmnjcdo.mongodb.net/?retryWrites=true&w=majority&appName=ShreeRaagaSWAADGHAR` | Production |
   | `NODE_ENV` | `production` | Production |

3. **Trigger Deployment:**
   - Go to "Deployments" tab
   - Click "Redeploy" or push new changes to trigger automatic deployment

---

## 🔧 Domain Configuration

Your domains are already configured:
- ✅ **Primary:** `www.shreeraagaswaadghar.com` (Production)
- ✅ **Secondary:** `shreeraagaswaadghar.com` (Redirect)
- ✅ **Vercel:** `shreeraga-main.vercel.app` (Production)

**Note:** The DNS change recommendation for `www.shreeraagaswaadghar.com` should be addressed by updating your domain's DNS settings to point to Vercel's servers.

---

## ✅ Post-Deployment Verification

After deployment, test these URLs:

### 🌐 Frontend URLs:
- **Main Site:** https://www.shreeraagaswaadghar.com
- **Categories:** https://www.shreeraagaswaadghar.com/#categories
- **Order Page:** https://www.shreeraagaswaadghar.com/order-details

### 🔌 API Endpoints:
- **Orders API:** https://www.shreeraagaswaadghar.com/api/orders
- **Health Check:** https://www.shreeraagaswaadghar.com/api

### 🧪 Console Checks:
1. **Open browser console (F12)**
2. **Verify no errors:**
   - ❌ No "Cannot redefine property: ethereum" errors
   - ❌ No 504 timeout errors from `/api/orders`
   - ✅ EmailJS configuration logs show correctly
   - ✅ API calls succeed or fall back gracefully

### 📧 Functionality Tests:
1. **Place a test order** - should work without errors
2. **Check email notifications** - should be sent via EmailJS
3. **Verify MongoDB storage** - orders should be saved to database

---

## 🚨 Troubleshooting

### If deployment fails:
```bash
# Check Vercel logs
vercel logs

# Re-link the project if needed
vercel link

# Force redeploy
vercel --prod --force
```

### If console errors persist:
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R)
3. **Check Network tab** for failed API calls
4. **Verify environment variables** in Vercel dashboard

### If MongoDB connection fails:
- Verify the connection string is correct
- Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)
- Confirm database user has read/write permissions

---

## 📊 Expected Results After Deployment

### ✅ Success Indicators:
- **Homepage loads** without console errors
- **API endpoints respond** within 15 seconds
- **Order placement works** and sends emails
- **MongoDB integration** saves orders successfully
- **Wallet injection errors** are prevented
- **Graceful fallbacks** work when services are unavailable

### 📱 User Experience:
- **Fast loading times** with optimized assets
- **Responsive design** works on all devices  
- **Error-free browsing** experience
- **Successful order completion** flow

---

## 🔄 Future Updates

To update the deployed application:
1. Make changes to your code
2. Run `npm run build` to test locally
3. Use `vercel --prod` to deploy updates
4. The domain will automatically serve the new version

**Your application is now ready for production! 🎉**
