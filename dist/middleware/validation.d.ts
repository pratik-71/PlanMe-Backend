import { Request, Response, NextFunction } from 'express';
export declare const validateUserCheck: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateDayPlan: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateDailyPlan: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validatePlanUpdate: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validateQueryParams: (requiredParams: string[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=validation.d.ts.map