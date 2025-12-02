import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from backend/.env explicitly (ESM-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Debug environment variables
console.log('🔧 Environment Variables Debug:');
console.log('PORT:', process.env.PORT);
console.log('SUPABASE_URL FULL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET (length: ' + process.env.SUPABASE_ANON_KEY.length + ')' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

import express from 'express';
import cors from 'cors';
import ordersRouter from './routes/orders.js';
import paymentsRouter from './routes/payments.js';
import reviewsRouter from './routes/reviews.js';

console.log("🚀 Starting ShreeRaagaSWAADGHAR API server...");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Log environment status
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Use the orders, payments and reviews routers
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/reviews', reviewsRouter);

// Add a test route
app.get('/', (req, res) => {
  res.send('ShreeRaagaSWAADGHAR API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api/orders`);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});
