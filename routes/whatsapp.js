import { Router } from 'express';
import twilio from 'twilio';

const router = Router();

const toWhatsApp = (v = '') => 'whatsapp:' + v.replace(/^whatsapp:/i, '').replace(/\s+/g, '');

router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).end();
});

router.post('/', async (req, res) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    const authToken = process.env.TWILIO_AUTH_TOKEN || '';
    const fromEnv = process.env.TWILIO_WHATSAPP_FROM || '';
    if (!accountSid || !authToken || !fromEnv) {
      return res.status(500).json({ success: false, error: 'Twilio credentials not configured on server' });
    }

    const client = twilio(accountSid, authToken);

    const body = req.body?.body;
    const toBody = req.body?.to;

    if (!body) {
      return res.status(400).json({ success: false, error: 'Missing required field: body' });
    }

    const to = toBody ? toWhatsApp(toBody) : toWhatsApp(process.env.TWILIO_WHATSAPP_TO || '');
    if (!to) {
      return res.status(400).json({ success: false, error: 'No destination number configured (body.to or TWILIO_WHATSAPP_TO required)' });
    }

    const message = await client.messages.create({
      from: toWhatsApp(fromEnv),
      to,
      body,
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ success: true, sid: message.sid, status: message.status });
  } catch (err) {
    console.error('Twilio send error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
});

export default router;
