import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import complaintsRouter from './backend/src/routes/complaints.js';
import aiRouter from './backend/src/routes/ai.js';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'SudhaarSetu Full-Stack Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Backend API Routes
  app.use('/api', complaintsRouter);
  app.use('/api/ai', aiRouter);

  // In development, mount Vite's dev server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static build files
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SudhaarSetu Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
