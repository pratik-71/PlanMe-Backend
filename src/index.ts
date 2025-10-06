import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as cron from 'node-cron';
import { config } from './config/database';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { DailyCompletionScheduler } from './services/dailyCompletionScheduler';

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = config.port;

// Middleware - Allow all origins for testing
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: false, // Disable credentials when allowing all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Request logging middleware (disabled for production)
// app.use((req, _res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// });

// Routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Self-ping mechanism to keep server awake on Render free plan
const startSelfPing = () => {
  const appUrl = config.appUrl;
  
  // Ping every 10 minutes to prevent server sleep
  cron.schedule('*/10 * * * *', async () => {
    try {
      const response = await fetch(`${appUrl}/api/health`);
      if (response.ok) {
        console.log(`[${new Date().toISOString()}] Self-ping successful - server kept awake`);
      } else {
        console.log(`[${new Date().toISOString()}] Self-ping failed - status: ${response.status}`);
      }
    } catch (error) {
      console.log(`[${new Date().toISOString()}] Self-ping error:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }, {
    timezone: 'UTC'
  });
  
  console.log('Self-ping mechanism started - pinging every 10 minutes');
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the daily completion scheduler
  DailyCompletionScheduler.start();
  
  // Start self-ping mechanism to keep server awake
  startSelfPing();
});

export default app;