import React from 'react';

const CancellationRefundPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Cancellation &amp; Refund Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 14 November 2025</p>

      <p className="mb-4">
        Welcome to <strong>Shree Raaga Swaad Ghar</strong>. This Cancellation &amp; Refund Policy explains how
        cancellations, returns and refunds are handled for orders placed through our website{' '}
        <a href="https://www.shreeraagaswaadghar.com" className="text-blue-600 underline">www.shreeraagaswaadghar.com</a>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Order Cancellation by Customer</h2>
      <p className="mb-2">You may request cancellation of your order in the following cases:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li><strong>Before dispatch:</strong> Cancellation is allowed only before the order is packed and handed over to the courier partner.</li>
        <li><strong>How to request:</strong> Please contact us immediately via phone or WhatsApp at <strong>+91 73053 91377</strong> or email at <a href="mailto:shreeraagaswaadghar@gmail.com" className="text-blue-600 underline">shreeraagaswaadghar@gmail.com</a> with your Order ID.</li>
      </ul>
      <p className="mb-4">If the order has already been dispatched, cancellation may not be possible. In such cases, please refer to the refund section below.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Cancellation by Shree Raaga Swaad Ghar</h2>
      <p className="mb-2">We reserve the right to cancel an order in the following situations:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Product is unavailable or out of stock.</li>
        <li>Incorrect pricing or product information due to technical error.</li>
        <li>Payment issues or non-receipt of payment.</li>
        <li>Orders that appear to be fraudulent, abusive or placed for resale.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Returns &amp; Replacement</h2>
      <p className="mb-2">Since we deal in food products, returns are accepted only under the circumstances mentioned below:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Product received is <strong>damaged, leaked or tampered</strong> at the time of delivery.</li>
        <li>Wrong product or quantity delivered compared to your order.</li>
        <li>Product is expired at the time of delivery.</li>
      </ul>
      <p className="mb-2">To be eligible for a replacement or refund, you must:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Raise a complaint within <strong>24 hours</strong> of delivery.</li>
        <li>Share clear photos/video of the outer packaging, product label and issue on WhatsApp at <strong>+91 73053 91377</strong> or email.</li>
        <li>Provide your Order ID, contact number and delivery address.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Refund Eligibility</h2>
      <p className="mb-2">Refunds may be approved in the following situations:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Order cancelled successfully before dispatch.</li>
        <li>Order cancelled by us due to non-availability or other reasons.</li>
        <li>Approved quality issue, damage in transit, or wrong product delivered where replacement is not possible.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Mode &amp; Timeline of Refund</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Refunds for online payments (UPI, cards, net banking, wallets etc.) will be processed to the <strong>original source of payment</strong> wherever possible.</li>
        <li>In some cases, we may offer refund via bank transfer or store credit / coupon.</li>
        <li>Once approved, refunds are typically initiated within <strong>3–7 working days</strong>. Actual credit to your account depends on your bank or payment provider.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Non-Refundable Cases</h2>
      <p className="mb-2">Refunds will not be provided in the following cases:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Change of mind or taste preference after delivery.</li>
        <li>Incorrect or incomplete address provided by the customer.</li>
        <li>Package not accepted at the time of delivery without valid reason.</li>
        <li>Issues raised after the specified complaint period.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
      <p className="mb-2">If you have any questions about this policy or need help with cancellation or refund, please contact us:</p>
      <ul className="list-disc pl-5 space-y-1 mb-6">
        <li><strong>Phone:</strong> +91 90250 85523</li>
        <li><strong>WhatsApp:</strong> +91 73053 91377</li>
        <li><strong>Email:</strong> <a href="mailto:shreeraagaswaadghar@gmail.com" className="text-blue-600 underline">shreeraagaswaadghar@gmail.com</a></li>
        <li><strong>Address:</strong> 99/50 Gopala Krishna Swamy Kovil Street, Krishnapuram, Tenkasi - 627759, Tamil Nadu, India</li>
      </ul>

      <p className="text-sm text-gray-500">
        This Cancellation &amp; Refund Policy is applicable to all online orders placed on our official website only.
      </p>
    </div>
  );
};

export default CancellationRefundPolicy;
