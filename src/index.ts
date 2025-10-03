import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  
  // Start the daily completion scheduler
  DailyCompletionScheduler.start();
  console.log(`⏰ Daily completion scheduler initialized`);
});

export default app;