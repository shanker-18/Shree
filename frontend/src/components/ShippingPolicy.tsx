import React from 'react';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Shipping Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: 14 November 2025</p>

      <p className="mb-4">
        This Shipping Policy describes how orders placed on{' '}
        <a href="https://www.shreeraagaswaadghar.com" className="text-blue-600 underline">www.shreeraagaswaadghar.com</a>
        {' '}are processed, shipped and delivered by <strong>Shree Raaga Swaad Ghar</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Serviceable Locations</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>We currently ship within India to selected pin codes serviced by our courier partners.</li>
        <li>Availability of delivery to your location will be confirmed at checkout based on your pin code.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Processing Time</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Orders are usually processed and dispatched within <strong>1–3 working days</strong> from the date of order confirmation.</li>
        <li>Orders placed on weekends or public holidays may be processed on the next working day.</li>
        <li>In case of any delay due to high order volume or other reasons, we will attempt to inform you via phone, WhatsApp or email.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Delivery Time</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Estimated delivery time after dispatch is typically <strong>3–7 working days</strong>, depending on your location and courier service.</li>
        <li>Remote or out-of-service areas may take longer for delivery.</li>
        <li>Delivery timelines are estimates only and may be affected by factors beyond our control (weather, strikes, logistics issues, etc.).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Shipping Charges</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Shipping charges, if applicable, will be displayed at checkout before you complete payment.</li>
        <li>We may offer free shipping or promotional rates from time to time; such offers will be clearly mentioned on the Website.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Order Tracking</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Once your order is dispatched, we will share the tracking details (AWB number / tracking link) via SMS, WhatsApp or email where available.</li>
        <li>You can use this information to track the current status of your shipment on the courier partner's website.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Delivery Attempts</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>Our courier partners will normally attempt delivery at the shipping address you provide.</li>
        <li>If you are unavailable at the time of delivery, they may contact you or attempt redelivery as per their policy.</li>
        <li>In case of repeated unsuccessful attempts or incorrect/incomplete address, the shipment may be returned to us. Additional charges may apply for re-shipment.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Damaged or Tampered Packages</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>If you notice that the package is damaged, tampered or leaked at the time of delivery, please do not accept the parcel or mention the issue to the delivery person.</li>
        <li>Take clear photos/videos of the package and contact us within <strong>24 hours</strong> of the attempted delivery.</li>
        <li>Quality and damage-related resolutions will be handled as per our{' '}
          <a href="/cancellation-refund.html" className="text-blue-600 underline">Cancellation &amp; Refund Policy</a>.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Change of Address</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li>If you wish to change the delivery address after placing an order, please contact us as soon as possible.</li>
        <li>Address changes may not be possible once the order is dispatched.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact Us</h2>
      <p className="mb-2">For any questions or support related to shipping and delivery, please contact us:</p>
      <ul className="list-disc pl-5 space-y-1 mb-6">
        <li><strong>Phone:</strong> +91 90250 85523</li>
        <li><strong>WhatsApp:</strong> +91 73053 91377</li>
        <li><strong>Email:</strong> <a href="mailto:shreeraagaswaadghar@gmail.com" className="text-blue-600 underline">shreeraagaswaadghar@gmail.com</a></li>
        <li><strong>Address:</strong> 99/50 Gopala Krishna Swamy Kovil Street, Krishnapuram, Tenkasi - 627759, Tamil Nadu, India</li>
      </ul>

      <p className="text-sm text-gray-500">
        This Shipping Policy is subject to change without prior notice. Please review this page periodically for updates.
      </p>
    </div>
  );
};

export default ShippingPolicy;
