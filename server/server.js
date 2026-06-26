const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set Security Headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins for testing/development
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Initialize Database connection (will fall back to JSON db if Mongo is unavailable)
connectDB();

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/content', require('./routes/content'));
app.use('/api/chatbot', require('./routes/chatbot'));

// API status check
app.get('/', (req, res) => {
  res.json({ message: 'AI-Solutions Backend API is online and running.' });
});

// Start Server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server launched in production mode on port ${PORT}`);
    console.log(`🔌 Check http://localhost:${PORT}/ for API status.`);
  });
}

module.exports = app; // exported for testing purposes
