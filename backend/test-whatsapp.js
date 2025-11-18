import { sendWhatsAppMessage } from './utils/sendWhatsApp.js';

const run = async () => {
  try {
    const msg = '✅ Order confirmed! Thank you for shopping with us.';
    await sendWhatsAppMessage(msg);
    console.log('Done');
  } catch (e) {
    process.exitCode = 1;
  }
};

run();
