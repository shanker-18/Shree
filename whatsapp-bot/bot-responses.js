// Product information database
const products = {
  powders: {
    name: "Powder Collection",
    items: [
      "Turmeric Powder - Pure virali turmeric, no additives",
      "Sambar Powder - Perfect blend for authentic sambar",
      "Rasam Powder - Aromatic spice mix for rasam",
      "Idli Powder - Traditional sesame powder",
      "Poondu Idli Powder - Garlic-infused powder"
    ]
  },
  pickles: {
    name: "Pickle Collection", 
    items: [
      "Poondu Pickle - Medicinal garlic pickle",
      "Pirandai Pickle - Good for digestion",
      "Jathikkai Pickle - Aids digestive function",
      "Mudakkathan Pickle - Anti-inflammatory properties",
      "Kara Narthangai Pickle - Tangy citron pickle"
    ]
  },
  mixes: {
    name: "Ready-to-Cook Mixes",
    items: [
      "Puliyotharai Mix - Tamarind rice mix",
      "Vathakkuzhambu Mix - Traditional gravy mix"
    ]
  }
};

function getAdvancedReply(text) {
  const lower = text.toLowerCase();
  
  // Greetings
  if (/(hi|hello|hey|vanakkam|namaste)/i.test(lower)) {
    return {
      type: 'text',
      content: `Vanakkam! 🙏 Welcome to ${process.env.BUSINESS_NAME}\n\nWe're your trusted source for authentic Tamil traditional spices and foods!\n\n🌟 What can I help you with today?\n\n*Quick Options:*\n1️⃣ View Products\n2️⃣ Free Samples\n3️⃣ Contact Info\n4️⃣ Order Process\n\nJust type a number or ask me anything!`
    };
  }

  // Product inquiries
  if (/(powder|sambar|rasam|turmeric|idli)/i.test(lower)) {
    let response = "🌶️ *Our Premium Powder Collection:*\n\n";
    products.powders.items.forEach((item, index) => {
      response += `${index + 1}. ${item}\n`;
    });
    response += `\n💰 Prices start from ₹50\n🚚 Free delivery on orders above ₹500\n\n*Want to try?* Get free samples: ${process.env.BUSINESS_WEBSITE}/free-samples`;
    return { type: 'text', content: response };
  }

  if (/(pickle|achar)/i.test(lower)) {
    let response = "🥒 *Our Traditional Pickle Collection:*\n\n";
    products.pickles.items.forEach((item, index) => {
      response += `${index + 1}. ${item}\n`;
    });
    response += `\n💰 Prices start from ₹80\n🌿 All pickles have medicinal benefits\n\n*Want to try?* Get free samples: ${process.env.BUSINESS_WEBSITE}/free-samples`;
    return { type: 'text', content: response };
  }

  // Free samples
  if (/free\s*sample/i.test(lower)) {
    return {
      type: 'text',
      content: `🎁 *FREE SAMPLES OFFER!*\n\n✅ Choose up to 7 items\n✅ Completely FREE shipping\n✅ Try before you buy\n\n🎯 *BONUS:* If you order products along with samples, get *10% extra discount!*\n\n👆 Claim now: ${process.env.BUSINESS_WEBSITE}/free-samples\n\n_No hidden charges, just pure taste!_ 😋`
    };
  }

  // Order process
  if (/(order|buy|purchase|how to)/i.test(lower)) {
    return {
      type: 'text',
      content: `🛒 *How to Order:*\n\n1️⃣ Visit our website: ${process.env.BUSINESS_WEBSITE}\n2️⃣ Browse categories & add items\n3️⃣ Create account or login\n4️⃣ Fill shipping details\n5️⃣ Choose payment method\n6️⃣ Confirm order\n\n📱 *Or WhatsApp us directly:*\n${process.env.BUSINESS_PHONE}\n\n🚚 *Delivery:* 3-5 business days\n💳 *Payment:* Cash on Delivery available`
    };
  }

  // Contact info
  if (/contact|phone|email|address|location/i.test(lower)) {
    return {
      type: 'text',
      content: `📞 *Contact Information:*\n\n📱 Phone: ${process.env.BUSINESS_PHONE}\n📧 Email: ${process.env.BUSINESS_EMAIL}\n📍 Address: ${process.env.BUSINESS_ADDRESS}\n🌐 Website: ${process.env.BUSINESS_WEBSITE}\n\n⏰ *Business Hours:*\nMon-Sat: 9 AM - 6 PM\nSunday: 10 AM - 4 PM\n\n_We respond within 30 minutes during business hours!_ ⚡`
    };
  }

  // Price inquiries
  if /(price|cost|rate|₹)/i.test(lower)) {
    return {
      type: 'text',
      content: `💰 *Our Price Range:*\n\n🌶️ Powders: ₹50 - ₹120\n🥒 Pickles: ₹80 - ₹150\n🍚 Ready Mixes: ₹60 - ₹100\n☕ Coffee Powder: ₹180\n🍘 Appalam: ₹40 - ₹80\n\n🎁 *Special Offers:*\n• Free shipping on orders ₹500+\n• 5% discount on first order\n• 10% discount with free samples\n\n📋 View detailed prices: ${process.env.BUSINESS_WEBSITE}/categories`
    };
  }

  // Numbers 1-4 for quick options
  if (text.trim() === '1') {
    return {
      type: 'text', 
      content: `🛍️ *Our Product Categories:*\n\n🌶️ **Powders** - Turmeric, Sambar, Rasam, Idli powders\n🥒 **Pickles** - Traditional varieties with health benefits\n🍚 **Ready Mixes** - Puliyotharai, Vathakkuzhambu\n🍘 **Appalam** - Crispy traditional papads\n☕ **Coffee** - Authentic South Indian filter coffee\n\n🌐 Browse all: ${process.env.BUSINESS_WEBSITE}/categories`
    };
  }

  if (text.trim() === '2') {
    return getAdvancedReply('free sample');
  }

  if (text.trim() === '3') {
    return getAdvancedReply('contact');
  }

  if (text.trim() === '4') {
    return getAdvancedReply('order');
  }

  // Default response
  return {
    type: 'text',
    content: `Thanks for reaching out! 😊\n\nI can help you with:\n• Product information\n• Free samples\n• Prices & ordering\n• Contact details\n\n_A human will also get back to you shortly._\n\n🌐 Meanwhile, browse our products: ${process.env.BUSINESS_WEBSITE}`
  };
}

module.exports = { getAdvancedReply, products };
