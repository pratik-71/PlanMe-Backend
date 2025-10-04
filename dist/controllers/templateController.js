"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const templateService_1 = require("../services/templateService");
class TemplateController {
}
exports.TemplateController = TemplateController;
_a = TemplateController;
TemplateController.createTemplate = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId, name, reminders } = req.body;
    if (!userId || !name || !reminders) {
        res.status(400).json({
            success: false,
            message: 'userId, name, and reminders are required',
        });
        return;
    }
    const template = await templateService_1.TemplateService.createTemplate(userId, name, reminders);
    res.status(201).json({
        success: true,
        data: template,
    });
});
TemplateController.getUserTemplates = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        res.status(400).json({
            success: false,
            message: 'userId is required',
        });
        return;
    }
    const templates = await templateService_1.TemplateService.getUserTemplates(userId);
    res.json({
        success: true,
        data: templates,
    });
});
TemplateController.getTemplate = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId, templateId } = req.params;
    if (!userId || !templateId) {
        res.status(400).json({
            success: false,
            message: 'userId and templateId are required',
        });
        return;
    }
    const template = await templateService_1.TemplateService.getTemplateById(userId, parseInt(templateId, 10));
    res.json({
        success: true,
        data: template,
    });
});
TemplateController.updateTemplate = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId, templateId } = req.params;
    const { name, reminders } = req.body;
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
    const template = await templateService_1.TemplateService.updateTemplate(userId, parseInt(templateId, 10), name, reminders);
    res.json({
        success: true,
        data: template,
    });
});
TemplateController.deleteTemplate = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId, templateId } = req.params;
    if (!userId || !templateId) {
        res.status(400).json({
            success: false,
            message: 'userId and templateId are required',
        });
        return;
    }
    await templateService_1.TemplateService.deleteTemplate(userId, parseInt(templateId, 10));
    res.json({
        success: true,
        message: 'Template deleted successfully',
    });
});
//# sourceMappingURL=templateController.js.map