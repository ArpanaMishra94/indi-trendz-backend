const nock = require('nock');

// Mock Stripe payment endpoint
nock('https://api.stripe.com')
  .post('/v1/charges')
  .reply(200, {
    id: 'ch_1J2Y7SC4lVtxjfRe1TzflWoa',
    amount: 2000,
    currency: 'usd',
    status: 'succeeded',
  });


// Mock PayPal payment endpoint
nock('https://api.paypal.com')
  .post('/v1/payments/payment')
  .reply(200, {
    id: 'PAY-1234567890',
    state: 'approved',
    transactions: [
      {
        amount: {
          total: '20.00',
          currency: 'USD',
        },
      },
    ],
  });