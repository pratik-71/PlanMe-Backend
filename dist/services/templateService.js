"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const TEMPLATES_TABLE = 'reminder_templates';
class TemplateService {
    static async createTemplate(userId, name, reminders) {
        try {
            if (!name || name.trim().length === 0) {
                throw new errorHandler_1.AppError('Template name is required', 400);
            }
            if (!reminders || reminders.length === 0) {
                throw new errorHandler_1.AppError('At least one reminder is required', 400);
            }
            for (const reminder of reminders) {
                if (!reminder.title || !reminder.time) {
                    throw new errorHandler_1.AppError('Each reminder must have title and time', 400);
                }
            }
            const { data, error } = await database_1.supabase
                .from(TEMPLATES_TABLE)
                .insert({
                user_id: userId,
                name: name.trim(),
                reminders: JSON.stringify(reminders),
            })
                .select()
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Failed to create template: ${error.message}`, 500);
            }
            return {
                ...data,
                reminders: typeof data.reminders === 'string'
                    ? JSON.parse(data.reminders)
                    : data.reminders,
            };
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError('Failed to create template', 500);
        }
    }
    static async getUserTemplates(userId) {
        try {
            const { data, error } = await database_1.supabase
                .from(TEMPLATES_TABLE)
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) {
                throw new errorHandler_1.AppError(`Failed to fetch templates: ${error.message}`, 500);
            }
            return (data || []).map(template => ({
                ...template,
                reminders: typeof template.reminders === 'string'
                    ? JSON.parse(template.reminders)
                    : template.reminders,
            }));
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError('Failed to fetch templates', 500);
        }
    }
    static async getTemplateById(userId, templateId) {
        try {
            const { data, error } = await database_1.supabase
                .from(TEMPLATES_TABLE)
                .select('*')
                .eq('id', templateId)
                .eq('user_id', userId)
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Template not found: ${error.message}`, 404);
            }
            return {
                ...data,
                reminders: typeof data.reminders === 'string'
                    ? JSON.parse(data.reminders)
                    : data.reminders,
            };
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError('Failed to fetch template', 500);
        }
    }
    static async updateTemplate(userId, templateId, name, reminders) {
        try {
            if (!name || name.trim().length === 0) {
                throw new errorHandler_1.AppError('Template name is required', 400);
            }
            if (!reminders || reminders.length === 0) {
                throw new errorHandler_1.AppError('At least one reminder is required', 400);
            }
            const { data, error } = await database_1.supabase
                .from(TEMPLATES_TABLE)
                .update({
                name: name.trim(),
                reminders: JSON.stringify(reminders),
                updated_at: new Date().toISOString(),
            })
                .eq('id', templateId)
                .eq('user_id', userId)
                .select()
                .single();
            if (error) {
                throw new errorHandler_1.AppError(`Failed to update template: ${error.message}`, 500);
            }
            return {
                ...data,
                reminders: typeof data.reminders === 'string'
                    ? JSON.parse(data.reminders)
                    : data.reminders,
            };
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError('Failed to update template', 500);
        }
    }
    static async deleteTemplate(userId, templateId) {
        try {
            const { error } = await database_1.supabase
                .from(TEMPLATES_TABLE)
                .delete()
                .eq('id', templateId)
                .eq('user_id', userId);
            if (error) {
                throw new errorHandler_1.AppError(`Failed to delete template: ${error.message}`, 500);
            }
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError('Failed to delete template', 500);
        }
    }
}
exports.TemplateService = TemplateService;
//# sourceMappingURL=templateService.js.map