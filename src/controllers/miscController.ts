import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { MiscService } from '../services/miscService';

export class MiscController {
  static getToday = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as { userId: string };
    console.log('[MISC] GET today', { userId });
    if (!userId) return res.status(400).json({ success: false, error: 'userId required' });
    const row = await MiscService.getToday(userId);
    console.log('[MISC] GET today ->', row);
    return res.json({ success: true, data: row });
  });

  static addProteinToday = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as { userId: string };
    const { protein } = req.body as { protein: number };
    console.log('[MISC] PUT today/protein', { userId, protein });
    if (!userId) return res.status(400).json({ success: false, error: 'userId required' });
    const updated = await MiscService.upsertTodayProtein(userId, Number(protein));
    console.log('[MISC] PUT today/protein ->', updated);
    return res.json({ success: true, data: updated });
  });

  static getProteinHistory = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params as { userId: string };
    const days = Number((req.query['days'] as string) || '10');
    const offset = Number((req.query['offsetDays'] as string) || '0');
    console.log('[MISC] GET protein-history', { userId, days, offset });
    if (!userId) return res.status(400).json({ success: false, error: 'userId required' });
    const data = await MiscService.getProteinHistory(userId, Math.max(1, days), Math.max(0, offset));
    console.log('[MISC] GET protein-history ->', data?.length);
    return res.json({ success: true, data });
  });
}


