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
export declare class DayPlanService {
    static saveDayPlan(dayPlan: Omit<DayPlan, 'id' | 'created_at' | 'updated_at'>): Promise<DayPlan>;
    static getUserDayPlans(userId: string): Promise<DayPlan[]>;
    static getDayPlan(planId: number): Promise<DayPlan | null>;
    static updateDayPlan(planId: number, updates: Partial<DayPlan>): Promise<DayPlan>;
    static deleteDayPlan(planId: number): Promise<boolean>;
}
export declare class DailyPlanService {
    static saveDailyPlan(dailyPlan: Omit<DailyPlan, 'id' | 'created_at' | 'updated_at'>): Promise<DailyPlan>;
    static getAllPlansForDate(userId: string, date: string): Promise<DailyPlan[]>;
    static updatePlan(planId: number, reminders: any[]): Promise<DailyPlan>;
    static getUserDailyPlans(userId: string): Promise<DailyPlan[]>;
    static getAllPlansForAllUsers(date: string): Promise<DailyPlan[]>;
    static getAllPlansForYesterday(yesterdayISO: string): Promise<DailyPlan[]>;
    static updatePlanCompletionStatus(planId: number, isCompleted: boolean): Promise<DailyPlan>;
}
//# sourceMappingURL=dayPlanService.d.ts.map