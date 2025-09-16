import { Router } from 'express';
import { DayPlanController } from '../controllers/dayPlanController';
import { validateDayPlan } from '../middleware/validation';

const router = Router();

// Day Plan Routes
// POST /plan_day - Save day plan
router.post('/', validateDayPlan, DayPlanController.saveDayPlan);

// GET /plan_day/:userId - Get user's day plans
router.get('/:userId', DayPlanController.getUserDayPlans);

// GET /plan_day/detail/:planId - Get specific day plan
router.get('/detail/:planId', DayPlanController.getDayPlan);

// PUT /plan_day/:planId - Update day plan
router.put('/:planId', DayPlanController.updateDayPlan);

// DELETE /plan_day/:planId - Delete day plan
router.delete('/:planId', DayPlanController.deleteDayPlan);

export default router;
