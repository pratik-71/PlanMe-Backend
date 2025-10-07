import { Router } from 'express';
import { MiscController } from '../controllers/miscController';

const router = Router();

// GET /misc/today/:userId - fetch today's misc record
router.get('/today/:userId', MiscController.getToday);

// PUT /misc/today/:userId/protein - add to today's protein (creates if missing)
router.put('/today/:userId/protein', MiscController.addProteinToday);

// GET /misc/protein-history/:userId?days=10&offsetDays=0
router.get('/protein-history/:userId', MiscController.getProteinHistory);

export default router;


