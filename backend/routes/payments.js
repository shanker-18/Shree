import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const router = express.Router();

// Initialize Razorpay client with credentials from environment variables
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn('⚠️  Razorpay keys are not set in environment variables. Online payments will not work.');
}

const razorpay = razorpayKeyId && razorpayKeySecret
  ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
  : null;

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ success: false, message: 'Razorpay is not configured on the server.' });
    }

    const { amount, currency = 'INR', receipt } = req.body || {};

    let normalizedAmount = Number(amount);
    if (!normalizedAmount || Number.isNaN(normalizedAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required to create a payment order.',
      });
    }

    // Normalize amount so we never double-convert rupees → paise.
    // Heuristic: for this store, real order totals in rupees will always be well below 10,000.
    // - If the incoming amount is small (< 10,000), treat it as RUPEES and convert once.
    // - If it's large (>= 10,000), treat it as already in PAISE and do NOT multiply again.
    let amountInPaise;
    if (normalizedAmount >= 10000) {
      console.log('🧾 Backend - treating received amount as PAISE:', normalizedAmount);
      amountInPaise = Math.round(normalizedAmount);
    } else {
      console.log('🧾 Backend - treating received amount as RUPEES:', normalizedAmount);
      amountInPaise = Math.round(normalizedAmount * 100);
    }

    const options = {
      amount: amountInPaise, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    console.log('🧾 Backend - amount sent to Razorpay (paise):', options.amount);

    const order = await razorpay.orders.create(options);
    console.log('🧾 Backend - Razorpay order.amount (paise):', order?.amount);

    return res.status(200).json({
      success: true,
      order,
      keyId: razorpayKeyId, // Send key_id so frontend can initialize Razorpay Checkout
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order.',
    });
  }
});

// Verify Razorpay payment signature
router.post('/verify', async (req, res) => {
  try {
    if (!razorpayKeySecret) {
      return res.status(500).json({ success: false, message: 'Razorpay is not configured on the server.' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing Razorpay payment details for verification.',
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment verification failed.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment.',
    });
  }
});

export default router;
