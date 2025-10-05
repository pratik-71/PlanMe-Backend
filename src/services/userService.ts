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
    console.log('=== USER SERVICE START ===');
    console.log('checkOrCreateUser called with:');
    console.log('- email:', email);
    console.log('- userId:', userId);
    console.log('- name:', name);
    
    try {
      console.log('Checking if user exists by email...');
      // Check if user exists by email
      const { data: existingUser, error: fetchError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email)
        .single();

      console.log('Supabase query result:');
      console.log('- existingUser:', JSON.stringify(existingUser, null, 2));
      console.log('- fetchError:', JSON.stringify(fetchError, null, 2));

      // Handle fetch error (not "not found" error)
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.log('Database error:', fetchError.message);
        throw new AppError(`Database error: ${fetchError.message}`, 500);
      }

      // If user exists, return them
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
      
      // If name provided, create new user
      if (name && userId) {
        console.log('Creating new user...');
        
        // First, create user in auth.users using Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: email,
          password: 'temp_password_' + Date.now(), // Temporary password
          email_confirm: true,
          user_metadata: {
            name: name,
            google_id: userId
          }
        });

        console.log('Auth user creation result:');
        console.log('- authUser:', JSON.stringify(authUser, null, 2));
        console.log('- authError:', JSON.stringify(authError, null, 2));

        if (authError) {
          console.log('Failed to create auth user:', authError.message);
          throw new AppError(`Failed to create auth user: ${authError.message}`, 500);
        }

        // Now create user in our User table using the auth user ID
        const { data: newUser, error: createError } = await supabase
          .from(TABLES.USERS)
          .insert([{ user_id: authUser.user.id, name, email }])
          .select()
          .single();

        console.log('Create user result:');
        console.log('- newUser:', JSON.stringify(newUser, null, 2));
        console.log('- createError:', JSON.stringify(createError, null, 2));

        if (createError) {
          console.log('Failed to create user:', createError.message);
          throw new AppError(`Failed to create user: ${createError.message}`, 500);
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
      // User doesn't exist and no name provided
      return {
        success: true,
        user: null,
        isNew: true,
      };
    } catch (error) {
      console.log('ERROR in UserService:', error);
      console.log('=== USER SERVICE ERROR ===');
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
      throw error;
    }
  }
}
