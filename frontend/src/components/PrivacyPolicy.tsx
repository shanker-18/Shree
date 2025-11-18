import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 14 November 2025</p>

      <p className="mb-4">
        At <strong>Shree Raaga Swaad Ghar</strong> ("we", "us", "our"), we value your privacy and are committed to
        protecting your personal information. This Privacy Policy explains how we collect, use, store and safeguard
        your data when you visit our website{' '}
        <a href="https://www.shreeraagaswaadghar.com" className="text-blue-600 underline">www.shreeraagaswaadghar.com</a>{' '}
        and use our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-2">We may collect the following types of information:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li><strong>Personal information:</strong> Name, phone number, email address, billing and shipping address and other details you provide when placing an order or contacting us.</li>
        <li><strong>Order information:</strong> Details of products purchased, transaction amount, payment method (handled securely via our payment gateway) and order history.</li>
        <li><strong>Technical information:</strong> IP address, browser type, device information, pages visited and usage data collected via cookies or similar technologies.</li>
        <li><strong>Communication data:</strong> Messages, emails, WhatsApp conversations or feedback shared with us for support.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-2">We use your information to:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Process, fulfil and deliver your orders.</li>
        <li>Communicate with you regarding your orders, payments or support requests.</li>
        <li>Send important updates regarding our products, policies or service changes.</li>
        <li>Improve our website, products and customer experience.</li>
        <li>Comply with legal, regulatory or tax requirements.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Payment Information</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>We may use third‑party payment gateways to process online payments.</li>
        <li>Your sensitive card, UPI or banking details are handled directly by the payment gateway and are <strong>not stored</strong> on our servers.</li>
        <li>Our payment partners may store and process your data in accordance with their own privacy policies.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies &amp; Tracking Technologies</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Our Website may use cookies or similar technologies to enhance user experience, remember preferences and understand how the site is used.</li>
        <li>You can control cookies through your browser settings, but disabling them may affect some features of the Website.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Information Sharing</h2>
      <p className="mb-2">We do not sell or rent your personal information. We may share your information only with:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Trusted service providers such as courier partners, payment gateways and IT service providers, solely for order fulfilment and Website operations.</li>
        <li>Law enforcement or government authorities when required by applicable law or to protect our legal rights.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Data Security</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>We implement reasonable technical and organizational measures to protect your information from unauthorized access, loss or misuse.</li>
        <li>However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Data Retention</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>We retain your information for as long as necessary to fulfil the purposes described in this Policy or as required by law (for example, tax and accounting regulations).</li>
        <li>You may request deletion or correction of your personal data by contacting us using the details below, subject to legal obligations.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Your Rights</h2>
      <p className="mb-2">Subject to applicable law, you may have the right to:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Access the personal information we hold about you.</li>
        <li>Request correction of inaccurate or incomplete information.</li>
        <li>Request deletion of your data where feasible.</li>
        <li>Withdraw consent for marketing communications.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Third‑Party Links</h2>
      <p className="mb-4">
        Our Website may contain links to third‑party sites (such as social media or payment gateways). We are not responsible for the privacy practices or content of those sites. Please review their privacy policies separately.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">10. Updates to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Continued use of our Website after such changes constitutes your acceptance of the revised Policy.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">11. Contact Us</h2>
      <p className="mb-2">If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us:</p>
      <ul className="list-disc pl-5 space-y-1 mb-6">
        <li><strong>Phone:</strong> +91 90250 85523</li>
        <li><strong>WhatsApp:</strong> +91 73053 91377</li>
        <li><strong>Email:</strong> <a href="mailto:shreeraagaswaadghar@gmail.com" className="text-blue-600 underline">shreeraagaswaadghar@gmail.com</a></li>
        <li><strong>Address:</strong> 99/50 Gopala Krishna Swamy Kovil Street, Krishnapuram, Tenkasi - 627759, Tamil Nadu, India</li>
      </ul>

      <p className="text-sm text-gray-500">
        By using our Website, you agree to the collection and use of information in accordance with this Privacy Policy.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
