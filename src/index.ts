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
  
  // Add delay to ensure server is fully ready
  setTimeout(() => {
    // Ping every 10 minutes to prevent server sleep
    cron.schedule('*/10 * * * *', async () => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Starting self-ping process...`);
      
      try {
        // Use the actual deployed URL for self-ping
        const pingUrl = `${appUrl}/api/health`;
        console.log(`[${timestamp}] Attempting self-ping to: ${pingUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(pingUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'PlanMe-SelfPing/1.0',
            'Connection': 'keep-alive',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`[${timestamp}] Self-ping successful - server kept awake`);
        } else {
          console.log(`[${timestamp}] Self-ping failed - status: ${response.status}`);
        }
      } catch (error) {
        console.log(`[${timestamp}] Self-ping error:`, error instanceof Error ? error.message : 'Unknown error');
        
        // Fallback - just log that server is alive
        console.log(`[${timestamp}] Fallback: Server is alive and processing (ping failed but server is running)`);
      }
    }, {
      timezone: 'UTC'
    });
    
    console.log('Self-ping mechanism started - pinging every 10 minutes');
  }, 30000); // Wait 30 seconds before starting pings
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