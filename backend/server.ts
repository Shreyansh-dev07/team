import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import complaintsRouter from './src/routes/complaints.js';
import aiRouter from './src/routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map(url => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Dev-friendly permissive
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'SudhaarSetu Kanpur Municipal API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api', complaintsRouter);
app.use('/api/ai', aiRouter);

// 404 handler for API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏛️  SudhaarSetu Kanpur Backend API Server running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
  console.log(`📋 Complaints: http://localhost:${PORT}/api/complaints`);
  console.log(`📊 Statistics: http://localhost:${PORT}/api/stats`);
  console.log(`=======================================================`);
});

export default app;
