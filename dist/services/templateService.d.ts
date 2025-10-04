export interface TemplateReminder {
    title: string;
    time: string;
}
export interface Template {
    id?: number;
    user_id: string;
    name: string;
    reminders: TemplateReminder[];
    created_at?: string;
    updated_at?: string;
}
export declare class TemplateService {
    static createTemplate(userId: string, name: string, reminders: TemplateReminder[]): Promise<Template>;
    static getUserTemplates(userId: string): Promise<Template[]>;
    static getTemplateById(userId: string, templateId: number): Promise<Template>;
    static updateTemplate(userId: string, templateId: number, name: string, reminders: TemplateReminder[]): Promise<Template>;
    static deleteTemplate(userId: string, templateId: number): Promise<void>;
}
//# sourceMappingURL=templateService.d.ts.map