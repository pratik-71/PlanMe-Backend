import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ExpenseService } from '../services/expenseService';

export class ExpenseController {
  static add = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { date, amount, category_id, category_title, note, payment_type } = req.body;
    if (!userId || !date || amount === undefined || !category_id || !category_title) {
      return res.status(400).json({ success: false, error: 'userId, date, amount, category_id, category_title are required' });
    }
    const data = await ExpenseService.addExpense({
      user_id: userId,
      date,
      amount: Number(amount),
      category_id,
      category_title,
      note,
      payment_type,
    });
    return res.json({ success: true, data });
  });

  static list = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { from, to } = req.query as { from?: string; to?: string };
    if (!userId || !from || !to) {
      return res.status(400).json({ success: false, error: 'userId, from, to are required' });
    }
    const data = await ExpenseService.listExpenses(userId, from, to);
    return res.json({ success: true, data });
  });

  static summary = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { from, to } = req.query as { from?: string; to?: string };
    if (!userId || !from || !to) {
      return res.status(400).json({ success: false, error: 'userId, from, to are required' });
    }
    const data = await ExpenseService.getSummary(userId, from, to);
    return res.json({ success: true, data });
  });
}


