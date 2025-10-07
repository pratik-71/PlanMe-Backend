import { supabase, TABLES } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface DailyFoodMisc {
  protein?: number; // grams consumed today
  // future extensibility: carbs, fats, notes, etc.
}

export interface MiscRow {
  id?: number;
  created_at?: string;
  user_id: string;
  Daily_Food_Misc: DailyFoodMisc;
}

export class MiscService {
  static async getToday(userId: string): Promise<MiscRow | null> {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from(TABLES.MISC)
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new AppError(`Failed to fetch today's misc: ${error.message}`, 500);
    }
    return data as MiscRow | null;
  }

  static async upsertTodayProtein(userId: string, addProtein: number): Promise<MiscRow> {
    if (!Number.isFinite(addProtein)) {
      throw new AppError('protein must be a number', 400);
    }

    const existing = await this.getToday(userId);
    const nowIso = new Date().toISOString();

    if (existing) {
      const current = existing.Daily_Food_Misc?.protein || 0;
      const updated: DailyFoodMisc = { ...existing.Daily_Food_Misc, protein: current + addProtein };
      const { data, error } = await supabase
        .from(TABLES.MISC)
        .update({ Daily_Food_Misc: updated })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw new AppError(`Failed to update protein: ${error.message}`, 500);
      return data as MiscRow;
    }

    const { data, error } = await supabase
      .from(TABLES.MISC)
      .insert({ user_id: userId, created_at: nowIso, Daily_Food_Misc: { protein: addProtein } })
      .select()
      .single();
    if (error) throw new AppError(`Failed to create misc: ${error.message}`, 500);
    return data as MiscRow;
  }

  static async getProteinHistory(userId: string, days: number, offsetDays = 0) {
    const now = new Date();
    now.setUTCHours(23, 59, 59, 999);
    const end = new Date(now);
    end.setUTCDate(end.getUTCDate() - offsetDays);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - (days - 1));
    start.setUTCHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from(TABLES.MISC)
      .select('id, created_at, Daily_Food_Misc, user_id')
      .eq('user_id', userId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116') {
      throw new AppError(`Failed to fetch protein history: ${error.message}`, 500);
    }

    // Map to date => protein (assuming at most one row per day)
    const byDate: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      const d = new Date(row.created_at);
      const key = d.toISOString().slice(0, 10);
      const p = Number(row?.Daily_Food_Misc?.protein || 0);
      byDate[key] = p;
    });

    const daysOut: Array<{ date: string; protein: number }> = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(end);
      d.setUTCDate(end.getUTCDate() - i);
      d.setUTCHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      daysOut.push({ date: key, protein: byDate[key] || 0 });
    }
    return daysOut; // newest first
  }
}


