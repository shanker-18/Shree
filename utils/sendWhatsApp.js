// Twilio / WhatsApp helper disabled. Kept only so imports do not break.

export const sendWhatsAppMessage = async (msg) => {
  console.warn('sendWhatsAppMessage called but WhatsApp/Twilio is disabled. Message was:', msg);
  return { success: false, disabled: true };
};
