export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'ShreeRaagaSWAADGHAR API is running with Supabase backend',
      timestamp: new Date().toISOString(),
      database: 'Supabase',
      endpoints: {
        orders: '/api/orders',
        whatsapp: '/api/whatsapp',
        health: '/api'
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    });
  }
}
