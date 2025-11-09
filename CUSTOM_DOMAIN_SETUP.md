# 🌐 Custom Domain Setup Guide

## Your Website Status
✅ **Deployed to Vercel**: https://shreeraga-main-3w9e8h60i-manis-projects-3c91d416.vercel.app
🎯 **Target Domain**: https://shreeraagaswaadghar.com

## Step-by-Step Domain Configuration

### 1. Add Domain in Vercel (Do This First)

1. Go to https://vercel.com/dashboard
2. Find and click on your project: **shreeraga-main**
3. Click **Settings** (gear icon)
4. Click **Domains** in the left sidebar
5. Click **Add Domain** button
6. Type: `shreeraagaswaadghar.com`
7. Click **Add**
8. **IMPORTANT**: Copy the DNS configuration that Vercel shows you

### 2. Configure DNS in Hostinger

#### Login to Hostinger:
1. Go to https://hpanel.hostinger.com/
2. Login with your credentials

#### Access DNS Zone:
1. Click **Domains** from the top menu
2. Find `shreeraagaswaadghar.com` and click **Manage**
3. Click **DNS Zone** tab

#### Update DNS Records:
**Delete existing A records** and add these:

```
Record Type: A
Name: @
Points to: 76.76.19.61
TTL: 3600
```

```
Record Type: CNAME  
Name: www
Points to: cname.vercel-dns.com
TTL: 3600
```

### 3. Verify Domain in Vercel

1. Go back to Vercel → Settings → Domains
2. Click **Verify** next to your domain
3. Wait 5-10 minutes for DNS propagation
4. Your site will be live at both:
   - https://shreeraagaswaadghar.com
   - https://www.shreeraagaswaadghar.com

## 🔧 Alternative: If you have different DNS values

Vercel might give you different IP addresses. If so, use the exact values Vercel provides instead of the ones above.

## 🚀 What Happens Next

- **SSL Certificate**: Automatically provisioned by Vercel
- **CDN**: Global edge network for fast loading
- **Automatic Deployments**: Any code changes will auto-deploy
- **API Endpoints**: Will work at your domain/api/*

## ⏱️ Timeline

- **DNS Update**: Immediate in Hostinger
- **Propagation**: 5 minutes to 48 hours (usually 5-10 minutes)
- **SSL Certificate**: 2-5 minutes after DNS resolves
- **Site Live**: As soon as SSL is ready

## 🧪 Testing

After setup, test:
1. https://shreeraagaswaadghar.com
2. https://www.shreeraagaswaadghar.com  
3. https://shreeraagaswaadghar.com/api
4. https://shreeraagaswaadghar.com/free-samples

## 🆘 Troubleshooting

### If domain doesn't work after 1 hour:

1. **Check DNS propagation**: https://whatsmydns.net/
2. **Verify Hostinger DNS**: Make sure old A records are removed
3. **Check Vercel status**: Ensure domain shows "Valid" in Vercel dashboard
4. **Clear browser cache**: Try incognito/private mode

### Common Issues:

- **"This site can't be reached"**: DNS not propagated yet, wait more
- **Vercel 404 page**: Domain not added correctly in Vercel
- **"Connection not secure"**: SSL certificate still being issued

## 📞 Need Help?

If you get stuck:
1. Check Vercel deployment logs in dashboard
2. Verify DNS settings in Hostinger match Vercel's requirements
3. Try accessing the Vercel URL first to ensure the app works

Your website will be live at your custom domain once DNS propagates! 🎉
