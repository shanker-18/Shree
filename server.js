import dotenv from 'dotenv';

// Load environment variables from .env file FIRST
dotenv.config();

// Debug environment variables
console.log('🔧 Environment Variables Debug:');
console.log('PORT:', process.env.PORT);
console.log('SUPABASE_URL FULL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET (length: ' + process.env.SUPABASE_ANON_KEY.length + ')' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

import express from 'express';
import cors from 'cors';
import ordersRouter from './routes/orders.js';
import whatsappRouter from './routes/whatsapp.js';

console.log("🚀 Starting ShreeRaagaSWAADGHAR API server...");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Log environment status
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Use the orders router
app.use('/api/orders', ordersRouter);
// WhatsApp route for local/dev
app.use('/api/whatsapp', whatsappRouter);

// Add a test route
app.get('/', (req, res) => {
  res.send('ShreeRaagaSWAADGHAR API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api/orders`);
  console.log(`WhatsApp API at http://localhost:${port}/api/whatsapp`);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});
