const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Payment = require('../models/Payment');
const { verifyAdmin } = require('../middleware/auth');

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

router.post('/create-order', async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ message: 'Payment service not configured' });
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ message: 'Payment service not configured' });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, teamId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !teamId)
      return res.status(400).json({ message: 'Sabhi payment fields required hain' });

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: 'Invalid signature' });

    const payment = new Payment({
      teamId,
      amount: 300,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'completed'
    });
    await payment.save();
    res.json({ message: 'Payment verified successfully', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/team/:teamId', async (req, res) => {
  try {
    const payments = await Payment.find({ teamId: req.params.teamId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;