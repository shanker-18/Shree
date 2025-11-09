const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// Health check
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok', service: 'whatsapp-bot' });
});

// Webhook verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Webhook receiver (POST)
app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages.length > 0) {
      const msg = messages[0];
      const from = msg.from; // user phone number
      const type = msg.type;
      let text = '';

      if (type === 'text') {
        text = msg.text.body.trim();
      } else if (type === 'interactive') {
        // Buttons/reply
        text = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || '';
      }

      console.log('Incoming message:', { from, text });

      // Craft reply
      const reply = buildReply(text);
      await sendMessage(from, reply);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
});

function buildReply(text) {
  const lower = (text || '').toLowerCase();
  // Simple intents
  if (/(hi|hello|hey)/i.test(lower)) {
    return `Vanakkam! 👋 This is ${process.env.BUSINESS_NAME}. How can we help you today?\n\nYou can ask about:\n• Products (sambar powder, pickles, etc.)\n• Free samples\n• Prices & delivery\n• Contact info`;
  }
  if (/free\s*sample/i.test(lower)) {
    return 'You can claim up to 7 free samples on our website. Visit: ' + process.env.BUSINESS_WEBSITE + '/free-samples';
  }
  if (/contact|phone|email|address/i.test(lower)) {
    return `Here are our contact details:\n📞 ${process.env.BUSINESS_PHONE}\n✉️ ${process.env.BUSINESS_EMAIL}\n📍 ${process.env.BUSINESS_ADDRESS}\n🌐 ${process.env.BUSINESS_WEBSITE}`;
  }
  if (/price|rate|cost/i.test(lower)) {
    return 'Our latest prices are listed on the website categories page: ' + process.env.BUSINESS_WEBSITE + '/categories';
  }

  // Default
  return 'Thanks for your message! A human will get back to you shortly. Meanwhile, you can browse our products here: ' + process.env.BUSINESS_WEBSITE;
}

async function sendMessage(to, body) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

app.listen(PORT, () => {
  console.log(`WhatsApp bot listening on port ${PORT}`);
});

