"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class UserService {
    static async checkOrCreateUser(email, userId, name) {
        try {
            const { data: existingUser, error: fetchError } = await database_1.supabase
                .from(database_1.TABLES.USERS)
                .select('*')
                .eq('email', email)
                .single();
            if (fetchError && fetchError.code !== 'PGRST116') {
                throw new errorHandler_1.AppError(`Database error: ${fetchError.message}`, 500);
            }
            if (existingUser) {
                return {
                    success: true,
                    user: existingUser,
                    isNew: false,
                };
            }
            if (name && userId) {
                const { data: newUser, error: createError } = await database_1.supabase
                    .from(database_1.TABLES.USERS)
                    .insert([{ user_id: userId, name, email }])
                    .select()
                    .single();
                if (createError) {
                    throw new errorHandler_1.AppError(`Failed to create user: ${createError.message}`, 500);
                }
                return {
                    success: true,
                    user: newUser,
                    isNew: true,
                };
            }
            return {
                success: true,
                user: null,
                isNew: true,
            };
        }
        catch (error) {
            throw error;
        }
    }
    static async getUserById(userId) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USERS)
                .select('*')
                .eq('user_id', userId)
                .single();
            if (error && error.code !== 'PGRST116') {
                throw new errorHandler_1.AppError(`Database error: ${error.message}`, 500);
            }
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    static async updateUser(userId, updates) {
        try {
            const { data, error } = await database_1.supabase
                .from(database_1.TABLES.USERS)
                .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
                .eq('user_id', userId)
                .select()
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Failed to update user: ${error.message}`, 500);
            }
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteUser(userId) {
        try {
            const { error } = await database_1.supabase
                .from(database_1.TABLES.USERS)
                .delete()
                .eq('user_id', userId);
            if (error) {
                throw new errorHandler_1.AppError(`Failed to delete user: ${error.message}`, 500);
            }
            return true;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map