import { Router } from 'express';
import { SchedulerController } from '../controllers/schedulerController';

const router = Router();

// Manual trigger endpoint (for testing)
router.post('/run-daily-check', SchedulerController.runDailyCheck);

// Get scheduler status
router.get('/status', SchedulerController.getStatus);

export default router;

