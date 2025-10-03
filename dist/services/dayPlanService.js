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
            console.log('🚨 DEBUG: getUserDayPlans called with userId:', userId);
            console.log('🚨 DEBUG: Querying table:', database_1.TABLES.DAY_PLANS);
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.DAY_PLANS)
                .select('*')
                .eq('user_id', userId)
                .order('selected_date', { ascending: false });
            console.log('🚨 DEBUG: getUserDayPlans result:', JSON.stringify(data, null, 2));
            console.log('🚨 DEBUG: getUserDayPlans error:', error);
            if (error) {
                throw new errorHandler_1.AppError(`Failed to fetch day plans: ${error.message}`, 500);
            }
            return data || [];
        }
        catch (error) {
            console.error('🚨 DEBUG: DayPlanService.getUserDayPlans error:', error);
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
    static async getAllPlansForDate(userId, date) {
        try {
            const targetDate = new Date(date);
            const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
            const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);
            const { data: exactData, error: exactError } = await database_1.supabase
                .from(database_1.TABLES.USER_DAILY_PLANS)
                .select('*')
                .eq('user_id', userId)
                .eq('plan_date', startOfDay.toISOString());
            let data = exactData;
            let error = exactError;
            if (exactError || !exactData || exactData.length === 0) {
                const rangeResult = await database_1.supabase
                    .from(database_1.TABLES.USER_DAILY_PLANS)
                    .select('*')
                    .eq('user_id', userId)
                    .gte('plan_date', startOfDay.toISOString())
                    .lt('plan_date', endOfDay.toISOString());
                data = rangeResult.data;
                error = rangeResult.error;
            }
            if (error && error.code !== 'PGRST116') {
                throw new errorHandler_1.AppError(`Failed to fetch plans for date: ${error.message}`, 500);
            }
            if (error && error.code === 'PGRST116') {
                return [];
            }
            return data || [];
        }
        catch (error) {
            console.error('DailyPlanService.getAllPlansForDate error:', error);
            throw error;
        }
    }
    static async updatePlan(planId, reminders) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USER_DAILY_PLANS)
                .update({
                reminders,
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
    static async getAllPlansForAllUsers(date) {
        try {
            const targetDate = new Date(date);
            const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(endOfDay.getDate() + 1);
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USER_DAILY_PLANS)
                .select('*')
                .gte('plan_date', startOfDay.toISOString())
                .lt('plan_date', endOfDay.toISOString());
            if (error && error.code !== 'PGRST116') {
                throw new errorHandler_1.AppError(`Failed to fetch all plans for date: ${error.message}`, 500);
            }
            return data || [];
        }
        catch (error) {
            console.error('DailyPlanService.getAllPlansForAllUsers error:', error);
            throw error;
        }
    }
    static async getAllPlansForYesterday(yesterdayISO) {
        try {
            const targetDate = new Date(yesterdayISO + 'T00:00:00Z');
            const startOfDay = new Date(targetDate);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(targetDate);
            endOfDay.setUTCHours(23, 59, 59, 999);
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USER_DAILY_PLANS)
                .select('*')
                .gte('plan_date', startOfDay.toISOString())
                .lte('plan_date', endOfDay.toISOString())
                .not('reminders', 'is', null);
            if (error && error.code !== 'PGRST116') {
                throw new errorHandler_1.AppError(`Failed to fetch plans for yesterday: ${error.message}`, 500);
            }
            return data || [];
        }
        catch (error) {
            console.error('DailyPlanService.getAllPlansForYesterday error:', error);
            throw error;
        }
    }
    static async updatePlanCompletionStatus(planId, isCompleted) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USER_DAILY_PLANS)
                .update({
                isCompleted,
                updated_at: new Date().toISOString(),
            })
                .eq('id', planId)
                .select()
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Failed to update plan completion status: ${error.message}`, 500);
            }
            return data;
        }
        catch (error) {
            console.error('DailyPlanService.updatePlanCompletionStatus error:', error);
            throw error;
        }
    }
}
exports.DailyPlanService = DailyPlanService;
//# sourceMappingURL=dayPlanService.js.map