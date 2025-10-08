import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { BucketListService, BucketListItem } from '../services/bucketListService';

export class BucketListController {
  /**
   * Get user's bucket list (JSONB array of objects)
   * GET /bucket-list/:userId
   */
  static getBucketList = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const bucketList = await BucketListService.getBucketList(userId);

    return res.json({
      success: true,
      bucketList,
    });
  });

  /**
   * Add new bucket list item (JSONB object)
   * POST /bucket-list/:userId
   */
  static addBucketListItem = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { title, description } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Title is required',
      });
    }

    const item: BucketListItem = {
      title: title.trim(),
      description: description?.trim() || '',
      priority_number: 0, // Will be set by service
    };

    const updatedBucketList = await BucketListService.addBucketListItem(userId, item);

    return res.json({
      success: true,
      message: 'Bucket list item added successfully',
      bucketList: updatedBucketList,
    });
  });

  /**
   * Update entire bucket list (JSONB array of objects)
   * PUT /bucket-list/:userId
   */
  static updateBucketList = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { bucketList } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    if (!Array.isArray(bucketList)) {
      return res.status(400).json({
        success: false,
        error: 'Bucket list must be an array',
      });
    }

    // Validate that all items have required fields
    const isValid = bucketList.every(item => 
      item && 
      typeof item.title === 'string' && 
      item.title.trim().length > 0 &&
      typeof item.description === 'string' &&
      typeof item.priority_number === 'number'
    );
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'All bucket list items must have valid title, description, and priority_number',
      });
    }

    const updatedBucketList = await BucketListService.updateBucketList(userId, bucketList);

    return res.json({
      success: true,
      message: 'Bucket list updated successfully',
      bucketList: updatedBucketList,
    });
  });

  /**
   * Reorder bucket list items (drag and drop)
   * PUT /bucket-list/:userId/reorder
   */
  static reorderBucketList = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { reorderedItems } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    if (!Array.isArray(reorderedItems)) {
      return res.status(400).json({
        success: false,
        error: 'Reordered items must be an array',
      });
    }

    const updatedBucketList = await BucketListService.reorderBucketList(userId, reorderedItems);

    return res.json({
      success: true,
      message: 'Bucket list reordered successfully',
      bucketList: updatedBucketList,
    });
  });
}
