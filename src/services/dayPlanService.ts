import { supabase, TABLES } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface TimeSlot {
  id: string;
  time: string;
  title: string;
  subgoals: string[];
  priority?: string;
  category?: string;
}

export interface DayPlan {
  id?: number;
  user_id: string;
  day_name: string;
  selected_date: string;
  time_slots: TimeSlot[];
  created_at?: string;
  updated_at?: string;
}

export interface DailyPlan {
  id?: number;
  user_id: string;
  plan_name: string;
  plan_date: string;
  reminders: any[];
  created_at?: string;
  updated_at?: string;
}

export class DayPlanService {
  /**
   * Save a day plan
   */
  static async saveDayPlan(dayPlan: Omit<DayPlan, 'id' | 'created_at' | 'updated_at'>): Promise<DayPlan> {
    try {
      const { data, error } = await supabase
        .from(TABLES.DAY_PLANS)
        .insert({
          ...dayPlan,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to save day plan: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      console.error('DayPlanService.saveDayPlan error:', error);
      throw error;
    }
  }

  /**
   * Get user's day plans
   */
  static async getUserDayPlans(userId: string): Promise<DayPlan[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.DAY_PLANS)
        .select('*')
        .eq('user_id', userId)
        .order('selected_date', { ascending: false });

      if (error) {
        throw new AppError(`Failed to fetch day plans: ${error.message}`, 500);
      }

      return data || [];
    } catch (error) {
      console.error('DayPlanService.getUserDayPlans error:', error);
      throw error;
    }
  }

  /**
   * Get specific day plan
   */
  static async getDayPlan(planId: number): Promise<DayPlan | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.DAY_PLANS)
        .select('*')
        .eq('id', planId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new AppError(`Failed to fetch day plan: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      console.error('DayPlanService.getDayPlan error:', error);
      throw error;
    }
  }

  /**
   * Update day plan
   */
  static async updateDayPlan(planId: number, updates: Partial<DayPlan>): Promise<DayPlan> {
    try {
      const { data, error } = await supabase
        .from(TABLES.DAY_PLANS)
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to update day plan: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      console.error('DayPlanService.updateDayPlan error:', error);
      throw error;
    }
  }

  /**
   * Delete day plan
   */
  static async deleteDayPlan(planId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.DAY_PLANS)
        .delete()
        .eq('id', planId);

      if (error) {
        throw new AppError(`Failed to delete day plan: ${error.message}`, 500);
      }

      return true;
    } catch (error) {
      console.error('DayPlanService.deleteDayPlan error:', error);
      throw error;
    }
  }
}

export class DailyPlanService {
  /**
   * Save daily plan with reminders
   */
  static async saveDailyPlan(dailyPlan: Omit<DailyPlan, 'id' | 'created_at' | 'updated_at'>): Promise<DailyPlan> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_DAILY_PLANS)
        .insert({
          ...dailyPlan,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to save daily plan: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      console.error('DailyPlanService.saveDailyPlan error:', error);
      throw error;
    }
  }

  /**
   * Get today's plan for a user
   */
  static async getTodayPlan(userId: string, date: string): Promise<DailyPlan | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_DAILY_PLANS)
        .select('*')
        .eq('user_id', userId)
        .eq('plan_date', date)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new AppError(`Failed to fetch today plan: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      console.error('DailyPlanService.getTodayPlan error:', error);
      throw error;
    }
  }

  /**
   * Update plan (for subgoal status changes)
   */
  static async updatePlan(planId: number, reminders: any[]): Promise<DailyPlan> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_DAILY_PLANS)
        .update({
          reminders,
          updated_at: new Date().toISOString(),
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to update plan: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      console.error('DailyPlanService.updatePlan error:', error);
      throw error;
    }
  }

  /**
   * Get user's daily plans
   */
  static async getUserDailyPlans(userId: string): Promise<DailyPlan[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_DAILY_PLANS)
        .select('*')
        .eq('user_id', userId)
        .order('plan_date', { ascending: false });

      if (error) {
        throw new AppError(`Failed to fetch daily plans: ${error.message}`, 500);
      }

      return data || [];
    } catch (error) {
      console.error('DailyPlanService.getUserDailyPlans error:', error);
      throw error;
    }
  }
}
