import { Request, Response } from 'express';
import { DayPlanService, DailyPlanService } from '../services/dayPlanService';
import { asyncHandler } from '../middleware/errorHandler';

export class DayPlanController {
  /**
   * Save day plan
   * POST /plan_day
   */
  static saveDayPlan = asyncHandler(async (req: Request, res: Response) => {
    const { userId, dayName, selectedDate, timeSlots } = req.body;

    const dayPlan = await DayPlanService.saveDayPlan({
      user_id: userId,
      day_name: dayName,
      selected_date: selectedDate,
      time_slots: timeSlots,
    });

    res.json({
      success: true,
      message: 'Day plan saved successfully',
      data: dayPlan,
    });
  });

  /**
   * Get user's day plans
   * GET /plan_day/:userId
   */
  static getUserDayPlans = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const dayPlans = await DayPlanService.getUserDayPlans(userId);

    return res.json({
      success: true,
      data: dayPlans,
    });
  });

  /**
   * Get specific day plan
   * GET /plan_day/detail/:planId
   */
  static getDayPlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;

    if (!planId) {
      return res.status(400).json({
        success: false,
        error: 'Plan ID is required',
      });
    }

    const dayPlan = await DayPlanService.getDayPlan(parseInt(planId));

    if (!dayPlan) {
      return res.status(404).json({
        success: false,
        error: 'Day plan not found',
      });
    }

    return res.json({
      success: true,
      data: dayPlan,
    });
  });

  /**
   * Update day plan
   * PUT /plan_day/:planId
   */
  static updateDayPlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;
    const updates = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        error: 'Plan ID is required',
      });
    }

    const dayPlan = await DayPlanService.updateDayPlan(parseInt(planId), updates);

    return res.json({
      success: true,
      message: 'Day plan updated successfully',
      data: dayPlan,
    });
  });

  /**
   * Delete day plan
   * DELETE /plan_day/:planId
   */
  static deleteDayPlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;

    if (!planId) {
      return res.status(400).json({
        success: false,
        error: 'Plan ID is required',
      });
    }

    await DayPlanService.deleteDayPlan(parseInt(planId));

    return res.json({
      success: true,
      message: 'Day plan deleted successfully',
    });
  });
}

export class DailyPlanController {
  /**
   * Add daily plan with reminders
   * POST /addPlan
   */
  static addPlan = asyncHandler(async (req: Request, res: Response) => {
    const { userId, planName, planDate, reminders } = req.body;

    const dailyPlan = await DailyPlanService.saveDailyPlan({
      user_id: userId,
      plan_name: planName,
      plan_date: planDate,
      reminders,
    });

    res.json({
      success: true,
      message: 'Daily plan saved successfully',
      data: dailyPlan,
    });
  });


  /**
   * Get all plans for a specific date
   * GET /getAllPlansForDate
   */
  static getAllPlansForDate = asyncHandler(async (req: Request, res: Response) => {
    const { userId, date } = req.query;

    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        error: 'User ID and date are required',
      });
    }

    const plans = await DailyPlanService.getAllPlansForDate(userId as string, date as string);

    return res.json({
      success: true,
      plans,
    });
  });

  /**
   * Update plan (for subgoal status changes)
   * PUT /updatePlan
   */
  static updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId, reminders } = req.body;

    const plan = await DailyPlanService.updatePlan(planId, reminders);

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    });
  });

  /**
   * Get user's daily plans
   * GET /daily-plans/:userId
   */
  static getUserDailyPlans = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const plans = await DailyPlanService.getUserDailyPlans(userId);

    return res.json({
      success: true,
      data: plans,
    });
  });
}
