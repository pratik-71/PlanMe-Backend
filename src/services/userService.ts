import { supabase, TABLES } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface User {
  user_id: string;
  name: string;
  email: string;
  id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserCheckResponse {
  success: boolean;
  user: User | null;
  isNew: boolean;
}

export class UserService {
  /**
   * Check if user exists by email, create if name provided
   */
  static async checkOrCreateUser(
    email: string,
    userId?: string,
    name?: string
  ): Promise<UserCheckResponse> {
    try {
      // Check if user exists by email
      const { data: existingUser, error: fetchError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email)
        .single();

      // Handle fetch error (not "not found" error)
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new AppError(`Database error: ${fetchError.message}`, 500);
      }

      // If user exists, return them
      if (existingUser) {
        return {
          success: true,
          user: existingUser,
          isNew: false,
        };
      }

      // If name provided, create new user
      if (name && userId) {
        const { data: newUser, error: createError } = await supabase
          .from(TABLES.USERS)
          .insert([{ user_id: userId, name, email }])
          .select()
          .single();

        if (createError) {
          throw new AppError(`Failed to create user: ${createError.message}`, 500);
        }

        return {
          success: true,
          user: newUser,
          isNew: true,
        };
      }

      // User doesn't exist and no name provided
      return {
        success: true,
        user: null,
        isNew: true,
      };
    } catch (error) {
      console.error('UserService.checkOrCreateUser error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new AppError(`Database error: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      console.error('UserService.getUserById error:', error);
      throw error;
    }
  }

  /**
   * Update user information
   */
  static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to update user: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      console.error('UserService.updateUser error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.USERS)
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new AppError(`Failed to delete user: ${error.message}`, 500);
      }

      return true;
    } catch (error) {
      console.error('UserService.deleteUser error:', error);
      throw error;
    }
  }
}
