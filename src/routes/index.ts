import { Router } from 'express';
import userRoutes from './userRoutes';
import dayPlanRoutes from './dayPlanRoutes';
import dailyPlanRoutes from './dailyPlanRoutes';
import schedulerRoutes from './schedulerRoutes';
import templateRoutes from './templateRoutes';
import miscRoutes from './miscRoutes';
import bucketListRoutes from './bucketListRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  const healthData = {
    success: true,
    message: 'Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env['NODE_ENV'] || 'development',
    port: process.env['PORT'] || 3001,
  };
  
  console.log(`[${new Date().toISOString()}] Health check accessed - server is alive`);
  res.json(healthData);
});

// API routes
router.use('/user', userRoutes);
router.use('/plan_day', dayPlanRoutes);
router.use('/scheduler', schedulerRoutes);
router.use('/templates', templateRoutes);
router.use('/misc', miscRoutes);
router.use('/bucket-list', bucketListRoutes);
router.use('/', dailyPlanRoutes);

export default router;
