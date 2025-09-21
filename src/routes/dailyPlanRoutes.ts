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

// GET /getAllPlansForDate - Get all plans for a specific date
router.get('/getAllPlansForDate', validateQueryParams(['userId', 'date']), DailyPlanController.getAllPlansForDate);

// PUT /updatePlan - Update plan (for subgoal status changes)
router.put('/updatePlan', validatePlanUpdate, DailyPlanController.updatePlan);

// GET /daily-plans/:userId - Get user's daily plans
router.get('/daily-plans/:userId', DailyPlanController.getUserDailyPlans);

export default router;
