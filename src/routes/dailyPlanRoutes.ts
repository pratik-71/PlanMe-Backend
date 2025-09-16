import { Router } from 'express';
import { DailyPlanController } from '../controllers/dayPlanController';
import { 
  validateDailyPlan, 
  validatePlanUpdate,
  validateQueryParams 
} from '../middleware/validation';

const router = Router();

// Daily Plan Routes
// POST /addPlan - Add daily plan with reminders
router.post('/addPlan', validateDailyPlan, DailyPlanController.addPlan);

// GET /getTodayPlan - Get today's plan for a user
router.get('/getTodayPlan', validateQueryParams(['userId', 'date']), DailyPlanController.getTodayPlan);

// PUT /updatePlan - Update plan (for subgoal status changes)
router.put('/updatePlan', validatePlanUpdate, DailyPlanController.updatePlan);

// GET /daily-plans/:userId - Get user's daily plans
router.get('/daily-plans/:userId', DailyPlanController.getUserDailyPlans);

export default router;
