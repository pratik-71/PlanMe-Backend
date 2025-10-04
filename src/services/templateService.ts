import {supabase} from '../config/database';
import {AppError} from '../middleware/errorHandler';

const TEMPLATES_TABLE = 'reminder_templates';

export interface TemplateReminder {
  title: string;
  time: string; // HH:MM format
}

export interface Template {
  id?: number;
  user_id: string;
  name: string;
  reminders: TemplateReminder[];
  created_at?: string;
  updated_at?: string;
}

export class TemplateService {
  /**
   * Create a new template
   */
  static async createTemplate(
    userId: string,
    name: string,
    reminders: TemplateReminder[],
  ): Promise<Template> {
    try {
      // Validate input
      if (!name || name.trim().length === 0) {
        throw new AppError('Template name is required', 400);
      }

      if (!reminders || reminders.length === 0) {
        throw new AppError('At least one reminder is required', 400);
      }

      // Validate reminders format
      for (const reminder of reminders) {
        if (!reminder.title || !reminder.time) {
          throw new AppError('Each reminder must have title and time', 400);
        }
      }

      const {data, error} = await supabase
        .from(TEMPLATES_TABLE)
        .insert({
          user_id: userId,
          name: name.trim(),
          reminders: JSON.stringify(reminders),
        })
        .select()
        .single();

      if (error) {
        throw new AppError(`Failed to create template: ${error.message}`, 500);
      }

      return {
        ...data,
        reminders:
          typeof data.reminders === 'string'
            ? JSON.parse(data.reminders)
            : data.reminders,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create template', 500);
    }
  }

  /**
   * Get all templates for a user
   */
  static async getUserTemplates(userId: string): Promise<Template[]> {
    try {
      const {data, error} = await supabase
        .from(TEMPLATES_TABLE)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false});

      if (error) {
        throw new AppError(`Failed to fetch templates: ${error.message}`, 500);
      }

      return (data || []).map(template => ({
        ...template,
        reminders:
          typeof template.reminders === 'string'
            ? JSON.parse(template.reminders)
            : template.reminders,
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch templates', 500);
    }
  }

  /**
   * Get a single template by ID
   */
  static async getTemplateById(
    userId: string,
    templateId: number,
  ): Promise<Template> {
    try {
      const {data, error} = await supabase
        .from(TEMPLATES_TABLE)
        .select('*')
        .eq('id', templateId)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new AppError(`Template not found: ${error.message}`, 404);
      }

      return {
        ...data,
        reminders:
          typeof data.reminders === 'string'
            ? JSON.parse(data.reminders)
            : data.reminders,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch template', 500);
    }
  }

  /**
   * Update an existing template
   */
  static async updateTemplate(
    userId: string,
    templateId: number,
    name: string,
    reminders: TemplateReminder[],
  ): Promise<Template> {
    try {
      // Validate input
      if (!name || name.trim().length === 0) {
        throw new AppError('Template name is required', 400);
      }

      if (!reminders || reminders.length === 0) {
        throw new AppError('At least one reminder is required', 400);
      }

      const {data, error} = await supabase
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
        throw new AppError(`Failed to update template: ${error.message}`, 500);
      }

      return {
        ...data,
        reminders:
          typeof data.reminders === 'string'
            ? JSON.parse(data.reminders)
            : data.reminders,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update template', 500);
    }
  }

  /**
   * Delete a template
   */
  static async deleteTemplate(
    userId: string,
    templateId: number,
  ): Promise<void> {
    try {
      const {error} = await supabase
        .from(TEMPLATES_TABLE)
        .delete()
        .eq('id', templateId)
        .eq('user_id', userId);

      if (error) {
        throw new AppError(`Failed to delete template: ${error.message}`, 500);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete template', 500);
    }
  }
}

