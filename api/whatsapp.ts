import type { VercelRequest, VercelResponse } from '@vercel/node';

// Helper to send JSON responses (with CORS)
const json = (res: VercelResponse, status: number, data: any) => {
  res
    .status(status)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Content-Type', 'application/json')
    .send(JSON.stringify(data));
};

// Normalize a phone value to Twilio WhatsApp address format
const toWhatsAppAddr = (value: string): string => {
  if (!value) return value;
  const cleaned = value.replace(/^whatsapp:/i, '').replace(/\s+/g, '');
  return `whatsapp:${cleaned}`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Basic method handling
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    const authToken = process.env.TWILIO_AUTH_TOKEN || '';
    const fromEnv = process.env.TWILIO_WHATSAPP_FROM || '';

    if (!accountSid || !authToken || !fromEnv) {
      return json(res, 500, { success: false, error: 'Twilio credentials not configured on server' });
    }

    const { from, to, body, order, recipient } = req.body || {};

    if (!body) {
      return json(res, 400, { success: false, error: 'Missing required field: body' });
    }

    // Always use server-side configured FROM for security
    const fromAddr = fromEnv;
    const toAddr = to ? toWhatsAppAddr(to) : toWhatsAppAddr(process.env.TWILIO_WHATSAPP_TO || '');

    if (!toAddr) {
      return json(res, 400, { success: false, error: 'No destination number configured (body.to or TWILIO_WHATSAPP_TO required)' });
    }

    const params = new URLSearchParams();
    params.append('From', fromAddr);
    params.append('To', toAddr);
    params.append('Body', body);

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const twilioResp = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await twilioResp.json();

    if (!twilioResp.ok) {
      return json(res, twilioResp.status, { success: false, error: data?.message || 'Twilio API error', details: data });
    }

    return json(res, 200, { success: true, sid: data.sid, status: data.status, to: toAddr, recipient, orderId: order?.id });
  } catch (err: any) {
    return json(res, 500, { success: false, error: err?.message || 'Server error' });
  }
}
