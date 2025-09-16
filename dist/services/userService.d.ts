export interface User {
    user_id: string;
    name: string;
    email: string;
    id?: number;
    created_at?: string;
    updated_at?: string;
}
export interface UserCheckResponse {
    success: boolean;
    user: User | null;
    isNew: boolean;
}
export declare class UserService {
    static checkOrCreateUser(email: string, userId?: string, name?: string): Promise<UserCheckResponse>;
    static getUserById(userId: string): Promise<User | null>;
    static updateUser(userId: string, updates: Partial<User>): Promise<User>;
    static deleteUser(userId: string): Promise<boolean>;
}
//# sourceMappingURL=userService.d.ts.map