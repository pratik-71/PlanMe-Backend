import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { MiscService } from '../services/miscService';

export class MiscController {
  static getToday = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as { userId: string };
    if (!userId) return res.status(400).json({ success: false, error: 'userId required' });
    const row = await MiscService.getToday(userId);
    return res.json({ success: true, data: row });
  });

  static addProteinToday = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as { userId: string };
    const { protein } = req.body as { protein: number };
    if (!userId) return res.status(400).json({ success: false, error: 'userId required' });
    const updated = await MiscService.upsertTodayProtein(userId, Number(protein));
    return res.json({ success: true, data: updated });
  });

  static getProteinHistory = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as { userId: string };
    const days = Number((req.query.days as string) || '10');
    const offset = Number((req.query.offsetDays as string) || '0');
    if (!userId) return res.status(400).json({ success: false, error: 'userId required' });
    const data = await MiscService.getProteinHistory(userId, Math.max(1, days), Math.max(0, offset));
    return res.json({ success: true, data });
  });
}


