"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStreakService = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const TABLES = {
    USERS: 'User',
};
class UserStreakService {
    static async incrementStreak(userId) {
        try {
            const { data: user, error: fetchError } = await database_1.supabase
                .from(TABLES.USERS)
                .select('streak')
                .eq('user_id', userId)
                .single();
            if (fetchError) {
                throw new errorHandler_1.AppError(`Failed to fetch user streak: ${fetchError.message}`, 500);
            }
            const currentStreak = user?.streak || 0;
            const newStreak = currentStreak + 1;
            const { error: updateError } = await database_1.supabase
                .from(TABLES.USERS)
                .update({ streak: newStreak })
                .eq('user_id', userId);
            if (updateError) {
                throw new errorHandler_1.AppError(`Failed to increment streak: ${updateError.message}`, 500);
            }
            return newStreak;
        }
        catch (error) {
            throw error;
        }
    }
    static async decrementStreak(userId) {
        try {
            const { data: user, error: fetchError } = await database_1.supabase
                .from(TABLES.USERS)
                .select('streak')
                .eq('user_id', userId)
                .single();
            if (fetchError) {
                throw new errorHandler_1.AppError(`Failed to fetch user streak: ${fetchError.message}`, 500);
            }
            const currentStreak = user?.streak || 0;
            const newStreak = Math.max(0, currentStreak - 1);
            const { error: updateError } = await database_1.supabase
                .from(TABLES.USERS)
                .update({ streak: newStreak })
                .eq('user_id', userId);
            if (updateError) {
                throw new errorHandler_1.AppError(`Failed to decrement streak: ${updateError.message}`, 500);
            }
            return newStreak;
        }
        catch (error) {
            throw error;
        }
    }
    static async resetStreak(userId) {
        try {
            const { error } = await database_1.supabase
                .from(TABLES.USERS)
                .update({ streak: 0 })
                .eq('user_id', userId);
            if (error) {
                throw new errorHandler_1.AppError(`Failed to reset streak: ${error.message}`, 500);
            }
        }
        catch (error) {
            throw error;
        }
    }
    static async getStreak(userId) {
        try {
            const { data: user, error } = await database_1.supabase
                .from(TABLES.USERS)
                .select('streak')
                .eq('user_id', userId)
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Failed to get user streak: ${error.message}`, 500);
            }
            return user?.streak || 0;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.UserStreakService = UserStreakService;
//# sourceMappingURL=userStreakService.js.map