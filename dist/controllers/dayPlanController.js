"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyPlanController = exports.DayPlanController = void 0;
const dayPlanService_1 = require("../services/dayPlanService");
const errorHandler_1 = require("../middleware/errorHandler");
class DayPlanController {
}
exports.DayPlanController = DayPlanController;
_a = DayPlanController;
DayPlanController.saveDayPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId, dayName, selectedDate, timeSlots } = req.body;
    const dayPlan = await dayPlanService_1.DayPlanService.saveDayPlan({
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
DayPlanController.getUserDayPlans = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'User ID is required',
        });
    }
    const dayPlans = await dayPlanService_1.DayPlanService.getUserDayPlans(userId);
    return res.json({
        success: true,
        data: dayPlans,
    });
});
DayPlanController.getDayPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { planId } = req.params;
    if (!planId) {
        return res.status(400).json({
            success: false,
            error: 'Plan ID is required',
        });
    }
    const dayPlan = await dayPlanService_1.DayPlanService.getDayPlan(parseInt(planId));
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
DayPlanController.updateDayPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { planId } = req.params;
    const updates = req.body;
    if (!planId) {
        return res.status(400).json({
            success: false,
            error: 'Plan ID is required',
        });
    }
    const dayPlan = await dayPlanService_1.DayPlanService.updateDayPlan(parseInt(planId), updates);
    return res.json({
        success: true,
        message: 'Day plan updated successfully',
        data: dayPlan,
    });
});
DayPlanController.deleteDayPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { planId } = req.params;
    if (!planId) {
        return res.status(400).json({
            success: false,
            error: 'Plan ID is required',
        });
    }
    await dayPlanService_1.DayPlanService.deleteDayPlan(parseInt(planId));
    return res.json({
        success: true,
        message: 'Day plan deleted successfully',
    });
});
class DailyPlanController {
}
exports.DailyPlanController = DailyPlanController;
_b = DailyPlanController;
DailyPlanController.addPlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId, planName, planDate, reminders } = req.body;
    const dailyPlan = await dayPlanService_1.DailyPlanService.saveDailyPlan({
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
DailyPlanController.getAllPlansForDate = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId, date } = req.query;
    if (!userId || !date) {
        return res.status(400).json({
            success: false,
            error: 'User ID and date are required',
        });
    }
    const plans = await dayPlanService_1.DailyPlanService.getAllPlansForDate(userId, date);
    return res.json({
        success: true,
        plans,
    });
});
DailyPlanController.updatePlan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { planId, reminders } = req.body;
    const plan = await dayPlanService_1.DailyPlanService.updatePlan(planId, reminders);
    res.json({
        success: true,
        message: 'Plan updated successfully',
        data: plan,
    });
});
DailyPlanController.getUserDailyPlans = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'User ID is required',
        });
    }
    const plans = await dayPlanService_1.DailyPlanService.getUserDailyPlans(userId);
    return res.json({
        success: true,
        data: plans,
    });
});
//# sourceMappingURL=dayPlanController.js.map