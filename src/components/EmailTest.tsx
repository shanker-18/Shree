import React from 'react';
import { testEmailJS } from '../services/email';

const EmailTest: React.FC = () => {
  const handleTestEmail = async () => {
    console.log("🧪 Starting EmailJS test...");
    await testEmailJS();
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">EmailJS Test</h2>
      <p className="text-gray-600 mb-6">
        Click the button below to test EmailJS functionality with sample data.
      </p>
      
      <button
        onClick={handleTestEmail}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        🧪 Test EmailJS
      </button>
      
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Test Email Details:</strong><br/>
          • To: shreeraagaswaadghar@gmail.com<br/>
          • Template: template_xdvaj0r<br/>
          • Service: service_lfndsjx<br/>
          • Check browser console for results
        </p>
      </div>
    </div>
  );
};

export default EmailTest;
