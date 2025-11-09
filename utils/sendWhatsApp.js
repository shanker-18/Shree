import twilio from 'twilio';
import dotenv from 'dotenv';

// Load env vars in local dev/testing; in serverless, the platform provides env
dotenv.config();

const required = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WHATSAPP_FROM',
  'TWILIO_WHATSAPP_TO'
];

const missing = required.filter((k) => !process.env[k] || !String(process.env[k]).trim());
if (missing.length) {
  console.warn('Missing Twilio env vars:', missing.join(', '));
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sanitizeWhats = (v = '') =>
  'whatsapp:' + v.replace(/^whatsapp:/i, '').replace(/\s+/g, '');

export const sendWhatsAppMessage = async (msg) => {
  try {
    const from = sanitizeWhats(process.env.TWILIO_WHATSAPP_FROM || '');
    const to = sanitizeWhats(process.env.TWILIO_WHATSAPP_TO || '');

    if (!from || !to) {
      throw new Error('TWILIO_WHATSAPP_FROM or TWILIO_WHATSAPP_TO not set');
    }

    const message = await client.messages.create({
      from,
      to,
      body: msg,
    });
    console.log('WhatsApp message sent:', message.sid);
    return message;
  } catch (err) {
    console.error('Error sending WhatsApp message:', err?.message || err);
    throw err;
  }
};
