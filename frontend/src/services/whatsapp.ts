// WhatsApp service disabled. This file is kept only so existing imports compile.

export interface WhatsAppOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{ name: string; qty: number; price?: number; weight?: string }>;
  totalPrice: string | number;
  paymentStatus: string;
  deliveryDate: string;
}

export const sendOrderNotificationWhatsApp = async (order: WhatsAppOrder) => {
  console.warn('sendOrderNotificationWhatsApp called but WhatsApp/Twilio is disabled. Order id:', order?.id);
  return { success: false, disabled: true } as const;
};

export const testWhatsApp = async () => {
  console.warn('testWhatsApp called but WhatsApp/Twilio is disabled.');
  return { success: false, disabled: true } as const;
};
