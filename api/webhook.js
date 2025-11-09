export default function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET request - WhatsApp webhook verification
  if (req.method === 'GET') {
    console.log('🔍 WhatsApp Webhook Verification Request:');
    console.log('Full URL:', req.url);
    console.log('Query params:', JSON.stringify(req.query, null, 2));
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    // WhatsApp webhook verification
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    console.log('Extracted parameters:');
    console.log('Mode:', mode);
    console.log('Token:', token);
    console.log('Challenge:', challenge);
    
    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === 'subscribe' && token === 'my_secret_token_123') {
        // Respond with 200 OK and challenge token from the request
        console.log('✅ WhatsApp Webhook verified successfully!');
        console.log('Sending challenge back:', challenge);
        return res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        console.log('❌ WhatsApp Webhook verification failed - invalid token');
        console.log('Expected: my_secret_token_123, Got:', token);
        return res.status(403).json({ 
          error: 'Verification failed', 
          received_token: token,
          expected_token: 'my_secret_token_123'
        });
      }
    } else {
      console.log('❌ WhatsApp Webhook verification failed - missing parameters');
      return res.status(400).json({ 
        error: 'Missing hub.mode or hub.verify_token',
        received_query: req.query
      });
    }
  }
  
  // POST request - WhatsApp message handler
  else if (req.method === 'POST') {
    console.log('📨 WhatsApp Webhook POST Request Received:');
    console.log('Full URL:', req.url);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    // Process the webhook payload here
    // You can add your message processing logic here
    
    // Acknowledge the webhook
    console.log('✅ Sending EVENT_RECEIVED response');
    return res.status(200).send('EVENT_RECEIVED');
  }
  
  // Method not allowed
  else {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
