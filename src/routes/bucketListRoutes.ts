import { Router } from 'express';
import { BucketListController } from '../controllers/bucketListController';

const router = Router();

// Bucket List Routes (JSONB Array of Objects)
router.get('/:userId', BucketListController.getBucketList);
router.post('/:userId', BucketListController.addBucketListItem);
router.put('/:userId', BucketListController.updateBucketList);
router.put('/:userId/reorder', BucketListController.reorderBucketList);

export default router;
