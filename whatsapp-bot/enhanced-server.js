const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { getAdvancedReply } = require('./bot-responses');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// Health check
app.get('/health', (req, res) => {
  res.status(200).send({ 
    status: 'ok', 
    service: 'shree-raaga-whatsapp-bot',
    timestamp: new Date().toISOString()
  });
});

// Webhook verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    return res.status(200).send(challenge);
  }
  
  console.log('❌ Webhook verification failed');
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
      for (const msg of messages) {
        await handleIncomingMessage(msg);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Webhook error:', err);
    res.sendStatus(500);
  }
});

async function handleIncomingMessage(msg) {
  try {
    const from = msg.from;
    const type = msg.type;
    let text = '';

    // Extract text from different message types
    if (type === 'text') {
      text = msg.text.body.trim();
    } else if (type === 'interactive') {
      text = msg.interactive?.button_reply?.title || 
             msg.interactive?.list_reply?.title || '';
    } else if (type === 'button') {
      text = msg.button?.text || '';
    }

    console.log(`📨 Message from ${from}: "${text}"`);

    // Skip if no text content
    if (!text) return;

    // Get bot response
    const replyData = getAdvancedReply(text);
    
    // Send response
    await sendMessage(from, replyData.content);
    
    console.log(`✅ Reply sent to ${from}`);
    
  } catch (error) {
    console.error('❌ Error handling message:', error);
  }
}

async function sendMessage(to, body) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    
    const response = await axios.post(
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

    return response.data;
  } catch (error) {
    console.error('❌ Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

// Function to send buttons (for future use)
async function sendButtons(to, text, buttons) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    
    await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text },
          action: {
            buttons: buttons.map((btn, index) => ({
              type: 'reply',
              reply: {
                id: `btn_${index}`,
                title: btn
              }
            }))
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('❌ Error sending buttons:', error);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Shree Raaga WhatsApp Bot running on port ${PORT}`);
  console.log(`📱 Business: ${process.env.BUSINESS_NAME}`);
  console.log(`🌐 Website: ${process.env.BUSINESS_WEBSITE}`);
});

module.exports = { sendMessage, sendButtons };
