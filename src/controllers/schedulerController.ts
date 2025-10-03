import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { DailyCompletionScheduler } from '../services/dailyCompletionScheduler';

export class SchedulerController {
  /**
   * Manually trigger the daily completion check (for testing)
   */
  static runDailyCheck = asyncHandler(async (_req: Request, res: Response) => {
    await DailyCompletionScheduler.runNow();
    
    res.json({
      success: true,
      message: 'Daily completion check executed successfully',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Get scheduler status
   */
  static getStatus = asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Daily completion scheduler is running',
      schedule: 'Every day at 2:00 AM',
      nextRun: 'Check server logs for next scheduled run',
    });
  });
}

