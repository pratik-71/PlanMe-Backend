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
  isCompleted?: boolean;
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
      console.log('🚨 DEBUG: getUserDayPlans called with userId:', userId);
      console.log('🚨 DEBUG: Querying table:', TABLES.DAY_PLANS);
      
      const { data, error } = await supabase
        .from(TABLES.DAY_PLANS)
        .select('*')
        .eq('user_id', userId)
        .order('selected_date', { ascending: false });

      console.log('🚨 DEBUG: getUserDayPlans result:', JSON.stringify(data, null, 2));
      console.log('🚨 DEBUG: getUserDayPlans error:', error);

      if (error) {
        throw new AppError(`Failed to fetch day plans: ${error.message}`, 500);
      }

      return data || [];
    } catch (error) {
      console.error('🚨 DEBUG: DayPlanService.getUserDayPlans error:', error);
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
   * Get all plans for a specific date for a user
   */
  static async getAllPlansForDate(userId: string, date: string): Promise<DailyPlan[]> {
    try {
      // Convert date to timestamp format for comparison
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);
      
      // Try exact date match first
      const { data: exactData, error: exactError } = await supabase
        .from(TABLES.USER_DAILY_PLANS)
        .select('*')
        .eq('user_id', userId)
        .eq('plan_date', startOfDay.toISOString());
        
      // If no exact match, try range query
      let data = exactData;
      let error = exactError;
      
      if (exactError || !exactData || exactData.length === 0) {
        const rangeResult = await supabase
          .from(TABLES.USER_DAILY_PLANS)
          .select('*')
          .eq('user_id', userId)
          .gte('plan_date', startOfDay.toISOString())
          .lt('plan_date', endOfDay.toISOString());
          
        data = rangeResult.data;
        error = rangeResult.error;
      }

      if (error && error.code !== 'PGRST116') {
        throw new AppError(`Failed to fetch plans for date: ${error.message}`, 500);
      }
      
      // PGRST116 means no rows found, which is not an error for our use case
      if (error && error.code === 'PGRST116') {
        return [];
      }

      return (data as DailyPlan[]) || [];
    } catch (error) {
      console.error('DailyPlanService.getAllPlansForDate error:', error);
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

  /**
   * Get all plans for a specific date across all users (for scheduler)
   * DEPRECATED: Use getAllPlansForYesterday instead for better performance
   */
  static async getAllPlansForAllUsers(date: string): Promise<DailyPlan[]> {
    try {
      const targetDate = new Date(date);
      const startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
      );
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const { data, error } = await supabase
        .from(TABLES.USER_DAILY_PLANS)
        .select('*')
        .gte('plan_date', startOfDay.toISOString())
        .lt('plan_date', endOfDay.toISOString());

      if (error && error.code !== 'PGRST116') {
        throw new AppError(
          `Failed to fetch all plans for date: ${error.message}`,
          500,
        );
      }

      return (data as DailyPlan[]) || [];
    } catch (error) {
      console.error('DailyPlanService.getAllPlansForAllUsers error:', error);
      throw error;
    }
  }

  /**
   * OPTIMIZED: Get yesterday's plans that need completion check
   * Only fetches plans from yesterday with reminders
   */
  static async getAllPlansForYesterday(yesterdayISO: string): Promise<DailyPlan[]> {
    try {
      const targetDate = new Date(yesterdayISO + 'T00:00:00Z');
      const startOfDay = new Date(targetDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const endOfDay = new Date(targetDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      // OPTIMIZATION: Only get plans that have reminders (not null/empty)
      const { data, error } = await supabase
        .from(TABLES.USER_DAILY_PLANS)
        .select('*')
        .gte('plan_date', startOfDay.toISOString())
        .lte('plan_date', endOfDay.toISOString())
        .not('reminders', 'is', null); // Filter out plans without reminders

      if (error && error.code !== 'PGRST116') {
        throw new AppError(
          `Failed to fetch plans for yesterday: ${error.message}`,
          500,
        );
      }

      return (data as DailyPlan[]) || [];
    } catch (error) {
      console.error('DailyPlanService.getAllPlansForYesterday error:', error);
      throw error;
    }
  }

  /**
   * Update plan completion status
   */
  static async updatePlanCompletionStatus(
    planId: number,
    isCompleted: boolean,
  ): Promise<DailyPlan> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_DAILY_PLANS)
        .update({
          isCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) {
        throw new AppError(
          `Failed to update plan completion status: ${error.message}`,
          500,
        );
      }

      return data;
    } catch (error) {
      console.error('DailyPlanService.updatePlanCompletionStatus error:', error);
      throw error;
    }
  }
}
