"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const dailyCompletionScheduler_1 = require("../services/dailyCompletionScheduler");
class SchedulerController {
}
exports.SchedulerController = SchedulerController;
_a = SchedulerController;
SchedulerController.runDailyCheck = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    await dailyCompletionScheduler_1.DailyCompletionScheduler.runNow();
    res.json({
        success: true,
        message: 'Daily completion check executed successfully',
        timestamp: new Date().toISOString(),
    });
});
SchedulerController.getStatus = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    res.json({
        success: true,
        message: 'Daily completion scheduler is running',
        schedule: 'Every day at 2:00 AM',
        nextRun: 'Check server logs for next scheduled run',
    });
});
//# sourceMappingURL=schedulerController.js.map