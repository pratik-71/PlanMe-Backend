"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyCompletionScheduler = void 0;
const cron = __importStar(require("node-cron"));
const dayPlanService_1 = require("./dayPlanService");
const userStreakService_1 = require("./userStreakService");
class DailyCompletionScheduler {
    static start() {
        if (this.cronJob) {
            return;
        }
        this.cronJob = cron.schedule('0 2 * * *', async () => {
            await this.checkAndUpdateCompletionStatus();
        }, {
            timezone: 'UTC',
        });
    }
    static stop() {
        if (this.cronJob) {
            this.cronJob.stop();
            this.cronJob = null;
        }
    }
    static async runNow() {
        await this.checkAndUpdateCompletionStatus();
    }
    static async checkAndUpdateCompletionStatus() {
        try {
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setUTCDate(yesterday.getUTCDate() - 1);
            yesterday.setUTCHours(0, 0, 0, 0);
            const yesterdayISO = yesterday.toISOString().slice(0, 10);
            const allPlans = await dayPlanService_1.DailyPlanService.getAllPlansForYesterday(yesterdayISO);
            if (!allPlans || allPlans.length === 0) {
                return;
            }
            let updatedCount = 0;
            let completedPlansCount = 0;
            let incompletePlansCount = 0;
            let skippedCount = 0;
            let streaksIncremented = 0;
            let streaksDecremented = 0;
            for (const plan of allPlans) {
                try {
                    if (!plan.reminders) {
                        skippedCount++;
                        continue;
                    }
                    let reminders = [];
                    if (typeof plan.reminders === 'string') {
                        try {
                            reminders = JSON.parse(plan.reminders);
                        }
                        catch (e) {
                            skippedCount++;
                            continue;
                        }
                    }
                    else if (Array.isArray(plan.reminders)) {
                        reminders = plan.reminders;
                    }
                    if (reminders.length === 0) {
                        skippedCount++;
                        continue;
                    }
                    const allRemindersCompleted = reminders.every((reminder) => reminder.completed === true);
                    const newCompletionStatus = allRemindersCompleted;
                    if (plan.isCompleted !== newCompletionStatus) {
                        await dayPlanService_1.DailyPlanService.updatePlanCompletionStatus(plan.id, newCompletionStatus);
                        updatedCount++;
                        try {
                            if (newCompletionStatus) {
                                await userStreakService_1.UserStreakService.incrementStreak(plan.user_id);
                                streaksIncremented++;
                            }
                            else {
                                await userStreakService_1.UserStreakService.decrementStreak(plan.user_id);
                                streaksDecremented++;
                            }
                        }
                        catch (streakError) {
                        }
                    }
                    if (newCompletionStatus) {
                        completedPlansCount++;
                    }
                    else {
                        incompletePlansCount++;
                    }
                }
                catch (error) {
                }
            }
        }
        catch (error) {
        }
    }
}
exports.DailyCompletionScheduler = DailyCompletionScheduler;
DailyCompletionScheduler.cronJob = null;
//# sourceMappingURL=dailyCompletionScheduler.js.map