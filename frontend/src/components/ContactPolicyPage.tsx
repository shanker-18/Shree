import React from 'react';

const ContactPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-sm text-gray-500 mb-6">
        We are happy to answer your questions and help you with your orders.
      </p>

      <p className="mb-4">
        For any queries regarding our products, orders, payments or partnerships, please reach out to us through any of
        the following channels:
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Business Details</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li><strong>Business Name:</strong> Shree Raaga Swaad Ghar</li>
        <li>
          <strong>Website:</strong>{' '}
          <a href="https://www.shreeraagaswaadghar.com" className="text-blue-600 underline">
            www.shreeraagaswaadghar.com
          </a>
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Registered Address</h2>
      <p className="mb-4">
        99/50 Gopala Krishna Swamy Kovil Street
        <br />
        Krishnapuram, Tenkasi - 627759
        <br />
        Tamil Nadu, India
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Numbers</h2>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li><strong>Phone:</strong> +91 90250 85523</li>
        <li><strong>WhatsApp:</strong> +91 73053 91377</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Email</h2>
      <p className="mb-4">
        <strong>Email ID:</strong>{' '}
        <a href="mailto:shreeraagaswaadghar@gmail.com" className="text-blue-600 underline">
          shreeraagaswaadghar@gmail.com
        </a>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Customer Support Timings</h2>
      <p className="mb-4">
        Monday to Saturday: 10:00 AM to 7:00 PM (IST)
        <br />
        Sundays and public holidays: Support available on WhatsApp; responses may be delayed.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Feedback &amp; Suggestions</h2>
      <p className="mb-4">
        We welcome your feedback to help us improve our products and service quality. You can share your feedback by
        emailing us or messaging us on WhatsApp.
      </p>

      <p className="text-sm text-gray-500">
        Note: For any payment related disputes or refund requests, please refer to our{' '}
        <a href="/cancellation-refund.html" className="text-blue-600 underline">
          Cancellation &amp; Refund Policy
        </a>
        .
      </p>
    </div>
  );
};

export default ContactPolicyPage;
