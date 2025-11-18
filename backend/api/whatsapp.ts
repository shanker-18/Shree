// Simplified WhatsApp API handler with all Twilio / WhatsApp sending disabled.

const jsonResponse = (data: any, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });

const preflight = (): Response =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return preflight();

  if (req.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method Not Allowed' }, 405);
  }

  // All WhatsApp/Twilio sending is disabled. We just acknowledge the request.
  return jsonResponse({ success: false, error: 'WhatsApp sending is disabled on this server.' }, 501);
}
