import { Request, Response } from 'express';
export declare class DayPlanController {
    static saveDayPlan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getUserDayPlans: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getDayPlan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static updateDayPlan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static deleteDayPlan: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare class DailyPlanController {
    static addPlan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getAllPlansForDate: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static updatePlan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getUserDailyPlans: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=dayPlanController.d.ts.map