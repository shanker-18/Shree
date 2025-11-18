import fetch from 'node-fetch';

async function testWebhookVerification() {
  console.log('🧪 Testing WhatsApp Webhook Verification...\n');
  
  // Test data
  const baseUrl = 'https://www.shreeraagaswaadghar.com';
  const testParams = {
    'hub.mode': 'subscribe',
    'hub.verify_token': 'my_secret_token_123',
    'hub.challenge': 'test_challenge_12345'
  };
  
  // Build URL with query parameters
  const urlParams = new URLSearchParams(testParams);
  const testUrl = `${baseUrl}/webhook?${urlParams}`;
  
  console.log('Testing URL:', testUrl);
  
  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'WhatsApp/1.0 (+https://developers.facebook.com/docs/whatsapp)'
      }
    });
    
    console.log('\n📊 Response Details:');
    console.log('Status Code:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    if (response.status === 200 && responseText === testParams['hub.challenge']) {
      console.log('\n✅ SUCCESS: Webhook verification working correctly!');
      console.log('Expected challenge:', testParams['hub.challenge']);
      console.log('Received challenge:', responseText);
    } else {
      console.log('\n❌ FAILED: Webhook verification not working');
      console.log('Expected status: 200, Got:', response.status);
      console.log('Expected body:', testParams['hub.challenge']);
      console.log('Received body:', responseText);
    }
    
  } catch (error) {
    console.error('\n🚨 ERROR: Failed to test webhook:', error.message);
  }
}

async function testWebhookPost() {
  console.log('\n🧪 Testing WhatsApp Webhook POST...\n');
  
  const baseUrl = 'https://www.shreeraagaswaadghar.com';
  const testPayload = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'test_id',
      changes: [{
        value: {
          messages: [{
            from: '1234567890',
            id: 'test_message_id',
            timestamp: '1234567890',
            text: { body: 'Hello, this is a test message!' },
            type: 'text'
          }]
        },
        field: 'messages'
      }]
    }]
  };
  
  console.log('Testing POST to:', `${baseUrl}/webhook`);
  console.log('Payload:', JSON.stringify(testPayload, null, 2));
  
  try {
    const response = await fetch(`${baseUrl}/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WhatsApp/1.0 (+https://developers.facebook.com/docs/whatsapp)'
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('\n📊 Response Details:');
    console.log('Status Code:', response.status);
    console.log('Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    if (response.status === 200 && responseText === 'EVENT_RECEIVED') {
      console.log('\n✅ SUCCESS: Webhook POST handling working correctly!');
    } else {
      console.log('\n❌ FAILED: Webhook POST not working as expected');
    }
    
  } catch (error) {
    console.error('\n🚨 ERROR: Failed to test webhook POST:', error.message);
  }
}

// Run tests
async function runAllTests() {
  await testWebhookVerification();
  await testWebhookPost();
}

runAllTests();
