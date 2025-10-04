import { Router } from 'express';
import userRoutes from './userRoutes';
import dayPlanRoutes from './dayPlanRoutes';
import dailyPlanRoutes from './dailyPlanRoutes';
import schedulerRoutes from './schedulerRoutes';
import templateRoutes from './templateRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
router.use('/user', userRoutes);
router.use('/plan_day', dayPlanRoutes);
router.use('/scheduler', schedulerRoutes);
router.use('/templates', templateRoutes);
router.use('/', dailyPlanRoutes);

export default router;
