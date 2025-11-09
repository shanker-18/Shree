import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { CartProvider } from './contexts/CartContext';
import { DemoProvider } from './contexts/DemoContext';
import emailjs from '@emailjs/browser';

// Debug: Log EmailJS configuration
console.log("🔍 EmailJS Configuration (main.tsx):");
console.log("Service ID: service_lfndsjx");
console.log("Template ID: template_xdvaj0r");
console.log("Public Key: _PAsQMMBy-RHc5NZL ✅ Set");

// Initialize EmailJS with public key
emailjs.init("_PAsQMMBy-RHc5NZL"); // 👈 Hardcoded for quick test
console.log("✅ EmailJS initialized");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
      <DemoProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </DemoProvider>
    </BrowserRouter>
  </StrictMode>
);
