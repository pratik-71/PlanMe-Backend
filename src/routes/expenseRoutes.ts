import { Router } from 'express';
import { ExpenseController } from '../controllers/expenseController';

const router = Router();

// POST /expenses/:userId
router.post('/:userId', ExpenseController.add);

// GET /expenses/:userId
router.get('/:userId', ExpenseController.list);

// GET /expenses/:userId/summary
router.get('/:userId/summary', ExpenseController.summary);

export default router;


