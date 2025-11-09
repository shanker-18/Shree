# Shree Raaga WhatsApp Bot Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Meta Developer Account**
3. **WhatsApp Business Account**
4. **Hosting Service** (Heroku, Railway, Vercel, etc.)

## Step-by-Step Setup

### 1. WhatsApp Business API Setup

1. **Create Meta Developer Account**
   - Go to https://developers.facebook.com/
   - Create account or login
   - Create new app → Business type

2. **Add WhatsApp Product**
   - In your app dashboard, click "Add Product"
   - Select "WhatsApp" → Get Started
   - Note down your Phone Number ID and Access Token

3. **Get Permanent Access Token**
   - Go to System Users in Business Settings
   - Create a system user
   - Generate a permanent token with whatsapp_business_messaging permissions

### 2. Local Development Setup

```bash
# Navigate to bot directory
cd E:\Ra\Shreeraga-main\whatsapp-bot

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your credentials
# WHATSAPP_TOKEN=your_permanent_access_token
# WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
# WEBHOOK_VERIFY_TOKEN=any_random_string_you_choose
```

### 3. Configure Webhook

1. **Deploy to a hosting service** (required for webhook)
2. **Set webhook URL** in Meta Developer Console:
   - Go to WhatsApp → Configuration
   - Webhook URL: `https://your-domain.com/webhook`
   - Verify Token: (same as in your .env file)
   - Subscribe to: `messages`

### 4. Test Your Bot

1. **Send a test message** to your WhatsApp Business number
2. **Check logs** to see if webhook receives the message
3. **Verify bot responds** correctly

## Deployment Options

### Option A: Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option B: Heroku

```bash
# Install Heroku CLI
# Create Procfile
echo "web: node enhanced-server.js" > Procfile

# Deploy
heroku create your-bot-name
heroku config:set WHATSAPP_TOKEN=your_token
heroku config:set WHATSAPP_PHONE_NUMBER_ID=your_id
heroku config:set WEBHOOK_VERIFY_TOKEN=your_verify_token
git push heroku main
```

### Option C: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
# Follow prompts and add environment variables
```

## Bot Features

### Current Responses

- **Greetings**: "Hi", "Hello", "Vanakkam"
- **Products**: Information about powders, pickles, mixes
- **Free Samples**: Details about free sample offer
- **Contact**: Business contact information
- **Pricing**: Price ranges and offers
- **Ordering**: How to place orders
- **Quick Options**: Numbers 1-4 for quick access

### Example Conversations

**User**: "Hi"
**Bot**: "Vanakkam! 🙏 Welcome to Shree Raaga Swaad Ghar..."

**User**: "sambar powder"
**Bot**: "🌶️ Our Premium Powder Collection: 1. Turmeric Powder..."

**User**: "free sample"
**Bot**: "🎁 FREE SAMPLES OFFER! ✅ Choose up to 7 items..."

## Customization

### Adding New Responses

Edit `bot-responses.js`:

```javascript
// Add new intent pattern
if (/your_pattern/i.test(lower)) {
  return {
    type: 'text',
    content: 'Your response message'
  };
}
```

### Adding Product Categories

Update the `products` object in `bot-responses.js`:

```javascript
const products = {
  newCategory: {
    name: "Category Name",
    items: [
      "Item 1 - Description",
      "Item 2 - Description"
    ]
  }
};
```

## Monitoring & Analytics

### Check Bot Health

Visit: `https://your-domain.com/health`

### View Logs

```bash
# For Railway
railway logs

# For Heroku
heroku logs --tail
```

## Advanced Features (Optional)

### 1. Add Buttons

```javascript
// In enhanced-server.js
await sendButtons(from, "Choose an option:", [
  "View Products",
  "Free Samples", 
  "Contact Us"
]);
```

### 2. Add Message Templates

Create approved templates in Meta Business Manager for:
- Order confirmations
- Shipping updates
- Promotional messages

### 3. Add Database Integration

```javascript
// Add to package.json
"mongodb": "^4.0.0"

// Track user conversations
const conversations = new Map();
```

## Troubleshooting

### Common Issues

1. **Webhook not receiving messages**
   - Check webhook URL is accessible
   - Verify webhook token matches
   - Ensure HTTPS is enabled

2. **Bot not responding**
   - Check access token is valid
   - Verify phone number ID is correct
   - Check server logs for errors

3. **Messages not sending**
   - Ensure phone number is verified
   - Check message format is correct
   - Verify API permissions

### Debug Commands

```bash
# Test webhook locally with ngrok
npx ngrok http 3000

# Check if server is running
curl https://your-domain.com/health

# Test message sending (replace with actual values)
curl -X POST \
  https://graph.facebook.com/v18.0/PHONE_ID/messages \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"messaging_product":"whatsapp","to":"RECIPIENT_PHONE","type":"text","text":{"body":"Test message"}}'
```

## Security Best Practices

1. **Never commit tokens** to version control
2. **Use environment variables** for all secrets
3. **Validate webhook signatures** (add webhook signature verification)
4. **Rate limit** incoming messages
5. **Monitor usage** to prevent abuse

## Support

For issues with:
- **WhatsApp API**: Check Meta Developer Documentation
- **Bot Logic**: Modify `bot-responses.js`
- **Deployment**: Check hosting service documentation

---

**Business Info**: Shree Raaga Swaad Ghar
**Contact**: +91 7305391377
**Website**: https://www.shreeraagaswaadghar.com
