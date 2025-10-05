"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class UserService {
    static async checkOrCreateUser(email, userId, name) {
        console.log('=== USER SERVICE START ===');
        console.log('checkOrCreateUser called with:');
        console.log('- email:', email);
        console.log('- userId:', userId);
        console.log('- name:', name);
        try {
            console.log('Checking if user exists by email...');
            const { data: existingUser, error: fetchError } = await database_1.supabase
                .from(database_1.TABLES.USERS)
                .select('*')
                .eq('email', email)
                .single();
            console.log('Supabase query result:');
            console.log('- existingUser:', JSON.stringify(existingUser, null, 2));
            console.log('- fetchError:', JSON.stringify(fetchError, null, 2));
            if (fetchError && fetchError.code !== 'PGRST116') {
                console.log('Database error:', fetchError.message);
                throw new errorHandler_1.AppError(`Database error: ${fetchError.message}`, 500);
            }
            if (existingUser) {
                console.log('User exists, returning existing user');
                console.log('=== USER SERVICE SUCCESS (EXISTING) ===');
                return {
                    success: true,
                    user: existingUser,
                    isNew: false,
                };
            }
            console.log('User does not exist');
            if (name && userId) {
                console.log('Creating new user...');
                const user_id = userId;
                console.log('Using Google user_id directly:', user_id);
                const { data: newUser, error: createError } = await database_1.supabase
                    .from(database_1.TABLES.USERS)
                    .insert([{ user_id: user_id, name, email }])
                    .select()
                    .single();
                console.log('Create user result:');
                console.log('- newUser:', JSON.stringify(newUser, null, 2));
                console.log('- createError:', JSON.stringify(createError, null, 2));
                if (createError) {
                    console.log('Failed to create user:', createError.message);
                    throw new errorHandler_1.AppError(`Failed to create user: ${createError.message}`, 500);
                }
                console.log('New user created successfully');
                console.log('=== USER SERVICE SUCCESS (NEW) ===');
                return {
                    success: true,
                    user: newUser,
                    isNew: true,
                };
            }
            console.log('User does not exist and no name provided');
            console.log('=== USER SERVICE SUCCESS (NO NAME) ===');
            return {
                success: true,
                user: null,
                isNew: true,
            };
        }
        catch (error) {
            console.log('ERROR in UserService:', error);
            console.log('=== USER SERVICE ERROR ===');
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