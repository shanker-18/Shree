import fetch from 'node-fetch';

const run = async () => {
  try {
    const res = await fetch('http://localhost:5001/api/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: '✅ Order confirmed! Test via local API' })
    });
    const data = await res.json();
    console.log('API response:', data);
  } catch (e) {
    console.error('Request failed:', e.message);
    process.exitCode = 1;
  }
};

run();
