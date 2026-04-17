import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';
import apiKeyMiddleware from './middleware/apiKeyMiddleware.js';
import rateLimiter from './middleware/rateLimiter.js';
import earlyAccessRoutes from './routes/earlyAccessRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// CORS — allow Hakkey website origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || 'https://www.hakkey.in')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));

app.use(express.json());
app.use(rateLimiter);

// Health check (no API key required)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'hakkey-website-backend' });
});

// API routes (API key required)
app.use('/api/v1/early-access', apiKeyMiddleware, earlyAccessRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 hakkey-website-backend running on port ${PORT}`);
  });
};

start();
