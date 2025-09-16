"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyPlanService = exports.DayPlanService = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class DayPlanService {
    static async saveDayPlan(dayPlan) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.DAY_PLANS)
                .insert({
                ...dayPlan,
                created_at: new Date().toISOString(),
            })
                .select()
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Failed to save day plan: ${error.message}`, 500);
            }
            return data;
        }
        catch (error) {
            console.error('DayPlanService.saveDayPlan error:', error);
            throw error;
        }
    }
    static async getUserDayPlans(userId) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.DAY_PLANS)
                .select('*')
                .eq('user_id', userId)
                .order('selected_date', { ascending: false });
            if (error) {
                throw new errorHandler_1.AppError(`Failed to fetch day plans: ${error.message}`, 500);
            }
            return data || [];
        }
        catch (error) {
            console.error('DayPlanService.getUserDayPlans error:', error);
            throw error;
        }
    }
    static async getDayPlan(planId) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.DAY_PLANS)
                .select('*')
                .eq('id', planId)
                .single();
            if (error && error.code !== 'PGRST116') {
                throw new errorHandler_1.AppError(`Failed to fetch day plan: ${error.message}`, 500);
            }
            return data;
        }
        catch (error) {
            console.error('DayPlanService.getDayPlan error:', error);
            throw error;
        }
    }
    static async updateDayPlan(planId, updates) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.DAY_PLANS)
                .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
                .eq('id', planId)
                .select()
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Failed to update day plan: ${error.message}`, 500);
            }
            return data;
        }
        catch (error) {
            console.error('DayPlanService.updateDayPlan error:', error);
            throw error;
        }
    }
    static async deleteDayPlan(planId) {
        try {
            const { error } = await database_1.supabase
                .from(database_1.TABLES.DAY_PLANS)
                .delete()
                .eq('id', planId);
            if (error) {
                throw new errorHandler_1.AppError(`Failed to delete day plan: ${error.message}`, 500);
            }
            return true;
        }
        catch (error) {
            console.error('DayPlanService.deleteDayPlan error:', error);
            throw error;
        }
    }
}
exports.DayPlanService = DayPlanService;
class DailyPlanService {
    static async saveDailyPlan(dailyPlan) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USER_DAILY_PLANS)
                .insert({
                ...dailyPlan,
                created_at: new Date().toISOString(),
            })
                .select()
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Failed to save daily plan: ${error.message}`, 500);
            }
            return data;
        }
        catch (error) {
            console.error('DailyPlanService.saveDailyPlan error:', error);
            throw error;
        }
    }
    static async getTodayPlan(userId, date) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USER_DAILY_PLANS)
                .select('*')
                .eq('user_id', userId)
                .eq('plan_date', date)
                .single();
            if (error && error.code !== 'PGRST116') {
                throw new errorHandler_1.AppError(`Failed to fetch today plan: ${error.message}`, 500);
            }
            return data;
        }
        catch (error) {
            console.error('DailyPlanService.getTodayPlan error:', error);
            throw error;
        }
    }
    static async updatePlan(planId, reminders) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USER_DAILY_PLANS)
                .update({
                reminders,
                updated_at: new Date().toISOString(),
            })
                .eq('id', planId)
                .select()
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Failed to update plan: ${error.message}`, 500);
            }
            return data;
        }
        catch (error) {
            console.error('DailyPlanService.updatePlan error:', error);
            throw error;
        }
    }
    static async getUserDailyPlans(userId) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USER_DAILY_PLANS)
                .select('*')
                .eq('user_id', userId)
                .order('plan_date', { ascending: false });
            if (error) {
                throw new errorHandler_1.AppError(`Failed to fetch daily plans: ${error.message}`, 500);
            }
            return data || [];
        }
        catch (error) {
            console.error('DailyPlanService.getUserDailyPlans error:', error);
            throw error;
        }
    }
}
exports.DailyPlanService = DailyPlanService;
//# sourceMappingURL=dayPlanService.js.map