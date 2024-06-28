const nock = require('nock');

// Mock logistics provider endpoint
nock('https://api.logistics.com')
  .post('/v1/shipments')
  .reply(200, {
    id: 'ship_1J2Y7SC4lVtxjfRe1TzflWoa',
    status: 'in-transit',
  });
