const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');

dotenv.config();

connectDB();

const app = express();

// Set security headers
app.use(helmet());

// Logging
app.use(morgan('combined'));

// Body parser
app.use(bodyParser.json());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// Mock services
require('./mockPayments');
require('./mockLogistics');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/logistics', logisticsRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production' || process.env.USE_HTTPS === 'true') {
  // Use HTTPS if in production or if USE_HTTPS environment variable is set to true
  const options = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
} else {
  // Development environment - use HTTP
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
