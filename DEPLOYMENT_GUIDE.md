# Deployment Guide for Shree Raaga SWAAD GHAR

## Prerequisites

1. Vercel account
2. GitHub repository
3. MongoDB Atlas database (optional, as the app works with in-memory storage)
4. EmailJS account (optional, for order notifications)

## Pre-deployment Steps

1. **Ensure all dependencies are installed:**
   ```bash
   npm install
   ```

2. **Test the build locally:**
   ```bash
   npm run build
   npm run preview
   ```

## Deployment to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from the project directory:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `shree-raaga-swaad-ghar`
   - In which directory is your code located? `./`

### Method 2: Using Vercel Dashboard

1. **Push code to GitHub**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Environment Variables

Set these environment variables in your Vercel dashboard:

### Required Variables:
```
NODE_ENV=production
```

### Optional Variables (for full functionality):
```
MONGODB_URI=your_mongodb_connection_string
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_TEMPLATE_WAREHOUSE=your_warehouse_template_id
VITE_EMAILJS_TEMPLATE_CUSTOMER=your_customer_template_id
VITE_WAREHOUSE_EMAIL=warehouse@example.com
```

## Firebase Configuration

The Firebase configuration is already set up in the codebase. The app includes:
- User authentication (Email/Password and Google)
- Email verification
- User profile management

## Features Implemented

✅ **Fixed MongoDB connection error** - Removed deprecated `bufferMaxEntries` option
✅ **Free sample popup** - 7 selectable items, no grams mention, same pricing for all users
✅ **25% discount offer** - Applied when ordering items along with free samples
✅ **Fixed navigation after signin** - Redirects to home instead of order details when no product selected
✅ **Email verification with Firebase** - Shows verification status in user profile
✅ **Fixed user menu orders function** - Now redirects to categories page
✅ **Fixed new user offer redirect** - Goes to categories section on homepage
✅ **City field as input** - Already implemented as text input field

## Post-Deployment Verification

1. **Test user registration** - Verify Firebase authentication works
2. **Test free sample popup** - Should appear after 3 seconds for new users
3. **Test cart functionality** - Verify 25% discount applies with free samples
4. **Test email verification** - Check if verification emails are sent
5. **Test navigation** - Ensure proper redirects after login/register

## Domain Configuration

After successful deployment:
1. **Custom domain** (optional):
   - Go to Vercel dashboard
   - Project Settings → Domains
   - Add your custom domain
   
2. **HTTPS** is automatically enabled by Vercel

## Monitoring and Analytics

- Vercel provides built-in analytics
- Firebase Analytics is configured for user behavior tracking
- Monitor application performance through Vercel dashboard

## Important Notes

- The application is configured to work without MongoDB (uses in-memory storage as fallback)
- All user data is stored locally in browser (localStorage) for development
- Firebase handles authentication and email verification
- EmailJS is used for order notifications (optional)

## Support

For issues during deployment:
1. Check Vercel build logs
2. Verify environment variables are set correctly
3. Ensure all dependencies are properly installed
4. Check Firebase configuration and project settings
