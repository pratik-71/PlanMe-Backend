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

// Simple and effective keep-alive mechanism for Render free plan
const startKeepAlive = () => {
  console.log('Starting keep-alive mechanism for Render free plan...');
  
  // Keep server active every 10 minutes (Render sleeps after 15 minutes)
  cron.schedule('*/10 * * * *', async () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Keep-alive: Triggering server activity`);
    
    try {
      // Create database activity to keep Supabase connection alive
      const { supabase } = require('./config/database');
      const { data, error } = await supabase
        .from('User')
        .select('id')
        .limit(1);
      
      if (error) {
        console.log(`[${timestamp}] Database keep-alive failed:`, error.message);
      } else {
        console.log(`[${timestamp}] Database keep-alive successful - connection active`);
      }
      
      // Log memory usage to show activity
      const memoryUsage = process.memoryUsage();
      console.log(`[${timestamp}] Memory: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);
      
    } catch (error) {
      console.log(`[${timestamp}] Keep-alive error:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }, {
    timezone: 'UTC'
  });
  
  console.log('Keep-alive mechanism started - database activity every 10 minutes');
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the daily completion scheduler
  DailyCompletionScheduler.start();
  
  // Start enhanced keep-alive mechanism to prevent Render sleep
  startKeepAlive();
});

export default app;