export declare class UserStreakService {
    static incrementStreak(userId: string): Promise<number>;
    static decrementStreak(userId: string): Promise<number>;
    static resetStreak(userId: string): Promise<void>;
    static getStreak(userId: string): Promise<number>;
}
//# sourceMappingURL=userStreakService.d.ts.map