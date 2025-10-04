import {Request, Response} from 'express';
import {asyncHandler} from '../middleware/errorHandler';
import {TemplateService} from '../services/templateService';

export class TemplateController {
  /**
   * POST /templates
   * Create a new template
   */
  static createTemplate = asyncHandler(async (req: Request, res: Response) => {
    const {userId, name, reminders} = req.body;

    if (!userId || !name || !reminders) {
      res.status(400).json({
        success: false,
        message: 'userId, name, and reminders are required',
      });
      return;
    }

    const template = await TemplateService.createTemplate(
      userId,
      name,
      reminders,
    );

    res.status(201).json({
      success: true,
      data: template,
    });
  });

  /**
   * GET /templates/:userId
   * Get all templates for a user
   */
  static getUserTemplates = asyncHandler(
    async (req: Request, res: Response) => {
      const {userId} = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'userId is required',
        });
        return;
      }

      const templates = await TemplateService.getUserTemplates(userId);

      res.json({
        success: true,
        data: templates,
      });
    },
  );

  /**
   * GET /templates/:userId/:templateId
   * Get a single template
   */
  static getTemplate = asyncHandler(async (req: Request, res: Response) => {
    const {userId, templateId} = req.params;

    if (!userId || !templateId) {
      res.status(400).json({
        success: false,
        message: 'userId and templateId are required',
      });
      return;
    }

    const template = await TemplateService.getTemplateById(
      userId,
      parseInt(templateId, 10),
    );

    res.json({
      success: true,
      data: template,
    });
  });

  /**
   * PUT /templates/:userId/:templateId
   * Update a template
   */
  static updateTemplate = asyncHandler(async (req: Request, res: Response) => {
    const {userId, templateId} = req.params;
    const {name, reminders} = req.body;

    if (!userId || !templateId) {
      res.status(400).json({
        success: false,
        message: 'userId and templateId are required',
      });
      return;
    }

    if (!name || !reminders) {
      res.status(400).json({
        success: false,
        message: 'name and reminders are required',
      });
      return;
    }

    const template = await TemplateService.updateTemplate(
      userId,
      parseInt(templateId, 10),
      name,
      reminders,
    );

    res.json({
      success: true,
      data: template,
    });
  });

  /**
   * DELETE /templates/:userId/:templateId
   * Delete a template
   */
  static deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
    const {userId, templateId} = req.params;

    if (!userId || !templateId) {
      res.status(400).json({
        success: false,
        message: 'userId and templateId are required',
      });
      return;
    }

    await TemplateService.deleteTemplate(userId, parseInt(templateId, 10));

    res.json({
      success: true,
      message: 'Template deleted successfully',
    });
  });
}

