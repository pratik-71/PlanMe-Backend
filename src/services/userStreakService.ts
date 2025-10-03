import { supabase } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const TABLES = {
  USERS: 'User',
};

export class UserStreakService {
  /**
   * Increment user's streak by 1 (when all reminders completed)
   */
  static async incrementStreak(userId: string): Promise<number> {
    try {
      // Get current streak
      const { data: user, error: fetchError } = await supabase
        .from(TABLES.USERS)
        .select('streak')
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        throw new AppError(
          `Failed to fetch user streak: ${fetchError.message}`,
          500,
        );
      }

      const currentStreak = user?.streak || 0;
      const newStreak = currentStreak + 1;

      // Update streak
      const { error: updateError } = await supabase
        .from(TABLES.USERS)
        .update({ streak: newStreak })
        .eq('user_id', userId);

      if (updateError) {
        throw new AppError(
          `Failed to increment streak: ${updateError.message}`,
          500,
        );
      }

      return newStreak;
    } catch (error) {
      console.error('UserStreakService.incrementStreak error:', error);
      throw error;
    }
  }

  /**
   * Decrement user's streak by 1 (when reminders incomplete)
   * Minimum streak is 0 (cannot go negative)
   */
  static async decrementStreak(userId: string): Promise<number> {
    try {
      // Get current streak
      const { data: user, error: fetchError } = await supabase
        .from(TABLES.USERS)
        .select('streak')
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        throw new AppError(
          `Failed to fetch user streak: ${fetchError.message}`,
          500,
        );
      }

      const currentStreak = user?.streak || 0;
      const newStreak = Math.max(0, currentStreak - 1); // Don't go below 0

      // Update streak
      const { error: updateError } = await supabase
        .from(TABLES.USERS)
        .update({ streak: newStreak })
        .eq('user_id', userId);

      if (updateError) {
        throw new AppError(
          `Failed to decrement streak: ${updateError.message}`,
          500,
        );
      }

      return newStreak;
    } catch (error) {
      console.error('UserStreakService.decrementStreak error:', error);
      throw error;
    }
  }

  /**
   * Reset user's streak to 0
   */
  static async resetStreak(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.USERS)
        .update({ streak: 0 })
        .eq('user_id', userId);

      if (error) {
        throw new AppError(
          `Failed to reset streak: ${error.message}`,
          500,
        );
      }
    } catch (error) {
      console.error('UserStreakService.resetStreak error:', error);
      throw error;
    }
  }

  /**
   * Get user's current streak
   */
  static async getStreak(userId: string): Promise<number> {
    try {
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('streak')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new AppError(
          `Failed to get user streak: ${error.message}`,
          500,
        );
      }

      return user?.streak || 0;
    } catch (error) {
      console.error('UserStreakService.getStreak error:', error);
      throw error;
    }
  }
}

