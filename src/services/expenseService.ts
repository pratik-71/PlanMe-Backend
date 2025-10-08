import { supabase } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface ExpenseLog {
  id?: string;
  user_id: string;
  date: string; // ISO date (YYYY-MM-DD)
  amount: number;
  category_id: string;
  category_title: string;
  note?: string;
  payment_type?: string;
  created_at?: string;
}

export class ExpenseService {
  static async addExpense(log: ExpenseLog) {
    const { data, error } = await supabase
      .from('expense_logs')
      .insert([
        {
          user_id: log.user_id,
          date: log.date,
          amount: log.amount,
          category_id: log.category_id,
          category_title: log.category_title,
          note: log.note ?? null,
          payment_type: log.payment_type ?? null,
        },
      ])
      .select()
      .single();
    if (error) throw new AppError(error.message, 500);
    return data;
  }

  static async listExpenses(userId: string, from: string, to: string) {
    const { data, error } = await supabase
      .from('expense_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: true });
    if (error) throw new AppError(error.message, 500);
    return data || [];
  }

  static async getSummary(userId: string, from: string, to: string) {
    // Daily series
    const { data: daily, error: errDaily } = await supabase
      .rpc('expense_daily_series', { p_user_id: userId, p_from: from, p_to: to });

    // Fallback if rpc not present: aggregate via query
    let dailySeries = daily;
    if (errDaily || !Array.isArray(daily)) {
      const { data: rows, error } = await supabase
        .from('expense_logs')
        .select('date, amount')
        .eq('user_id', userId)
        .gte('date', from)
        .lte('date', to);
      if (error) throw new AppError(error.message, 500);
      const map: Record<string, number> = {};
      for (const r of rows || []) {
        map[r.date] = (map[r.date] || 0) + Number(r.amount || 0);
      }
      dailySeries = Object.entries(map)
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => (a.date < b.date ? -1 : 1));
    }

    // By category
    const { data: byCatRows, error: errCat } = await supabase
      .from('expense_logs')
      .select('category_title, amount')
      .eq('user_id', userId)
      .gte('date', from)
      .lte('date', to);
    if (errCat) throw new AppError(errCat.message, 500);
    const byCategoryMap: Record<string, number> = {};
    for (const r of byCatRows || []) {
      const k = r.category_title || 'Misc';
      byCategoryMap[k] = (byCategoryMap[k] || 0) + Number(r.amount || 0);
    }
    const byCategory = Object.entries(byCategoryMap)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    const sum = (dailySeries || []).reduce((s: number, d: any) => s + Number(d.total || 0), 0);
    const days = Math.max(1, (dailySeries || []).length);
    const avgPerDay = sum / days;
    const topCategory = byCategory[0]?.category || null;

    return {
      dailySeries,
      byCategory,
      totals: { sum, avgPerDay, days, topCategory },
    };
  }
}


