const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock Stripe payment data
const stripePaymentData = {
  amount: 2000,
  currency: 'usd',
  source: 'tok_visa', // Replace with actual source token or mock token
};

// Mock PayPal payment data
const paypalPaymentData = {
  intent: 'sale',
  payer: {
    payment_method: 'paypal',
  },
  transactions: [
    {
      amount: {
        total: '20.00',
        currency: 'USD',
      },
      description: 'This is the payment transaction description.',
    },
  ],
  redirect_urls: {
    return_url: 'https://example.com/your_redirect_url',
    cancel_url: 'https://example.com/your_cancel_url',
  },
};

router.post('/stripe', async (req, res) => {
  try {
    const response = await axios.post('https://api.stripe.com/v1/charges', stripePaymentData);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/paypal', async (req, res) => {
  try {
    const response = await axios.post('https://api.paypal.com/v1/payments/payment', paypalPaymentData);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;