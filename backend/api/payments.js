export default async function handler(req, res) {
  // Basic CORS support (if needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, url } = req;

  // Route based on path: /api/payments/create-order or /api/payments/verify
  if (url.endsWith('/create-order') && method === 'POST') {
    return res.status(501).json({ success: false, message: 'Online payments are currently disabled.' });
  }

  if (url.endsWith('/verify') && method === 'POST') {
    return res.status(501).json({ success: false, message: 'Online payments are currently disabled.' });
  }

  // Method/path not allowed
  res.setHeader('Allow', ['POST', 'OPTIONS']);
  return res.status(405).json({
    success: false,
    message: `Method ${method} not allowed for ${url}`,
  });
}
