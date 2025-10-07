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
    // Use India Standard Time (UTC+05:30) for day boundaries
    const tzOffsetMinutes = 330; // IST
    const now = new Date();
    const local = new Date(now.getTime() + tzOffsetMinutes * 60 * 1000);
    const localStart = new Date(local);
    localStart.setHours(0, 0, 0, 0);
    const localEnd = new Date(localStart);
    localEnd.setHours(23, 59, 59, 999);
    // Convert back to UTC instants for storage comparison
    const start = new Date(localStart.getTime() - tzOffsetMinutes * 60 * 1000);
    const end = new Date(localEnd.getTime() - tzOffsetMinutes * 60 * 1000);

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
    console.log('[MISC] getToday window IST->UTC', {
      start: start.toISOString(),
      end: end.toISOString(),
      found: !!data,
    });
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
      console.log('[MISC] update existing row', { id: existing.id, newProtein: updated.protein });
      return data as MiscRow;
    }

    const { data, error } = await supabase
      .from(TABLES.MISC)
      .insert({ user_id: userId, created_at: nowIso, Daily_Food_Misc: { protein: addProtein } })
      .select()
      .single();
    if (error) throw new AppError(`Failed to create misc: ${error.message}`, 500);
    console.log('[MISC] created new row', { id: (data as any)?.id, protein: addProtein });
    return data as MiscRow;
  }

  static async getProteinHistory(userId: string, days: number, offsetDays = 0) {
    // India Standard Time boundaries
    const tzOffsetMinutes = 330; // IST
    const nowUtc = new Date();
    const nowLocal = new Date(nowUtc.getTime() + tzOffsetMinutes * 60 * 1000);
    nowLocal.setHours(23, 59, 59, 999);
    const endLocal = new Date(nowLocal);
    endLocal.setDate(endLocal.getDate() - offsetDays);
    const startLocal = new Date(endLocal);
    startLocal.setDate(startLocal.getDate() - (days - 1));
    startLocal.setHours(0, 0, 0, 0);
    // Convert to UTC instants for DB compare
    const end = new Date(endLocal.getTime() - tzOffsetMinutes * 60 * 1000);
    const start = new Date(startLocal.getTime() - tzOffsetMinutes * 60 * 1000);

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
    console.log('[MISC] history window IST->UTC', {
      start: start.toISOString(),
      end: end.toISOString(),
      rows: (data || []).length,
    });

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
      const dl = new Date(endLocal);
      dl.setDate(endLocal.getDate() - i);
      dl.setHours(0, 0, 0, 0);
      // For labels, use IST date string (YYYY-MM-DD)
      const key = new Date(dl.getTime()).toISOString().slice(0, 10);
      // But lookup uses UTC day keys from fetched rows; compute matching UTC key at 00:00 IST of that day
      const utcKeyDate = new Date(dl.getTime() - tzOffsetMinutes * 60 * 1000);
      const utcKey = utcKeyDate.toISOString().slice(0, 10);
      const value = byDate[utcKey] ?? byDate[key] ?? 0;
      daysOut.push({ date: key, protein: value });
    }
    return daysOut; // newest first
  }
}


