import { Router } from 'express';

const router = Router();

// WhatsApp / Twilio sending has been disabled. This route is kept only to avoid 404s.
router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).end();
});

router.post('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(501).json({ success: false, error: 'WhatsApp sending is disabled on this server.' });
});

export default router;
