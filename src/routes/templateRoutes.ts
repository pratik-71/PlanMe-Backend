import {Router} from 'express';
import {TemplateController} from '../controllers/templateController';

const router = Router();

// Create a template
router.post('/', TemplateController.createTemplate);

// Get all templates for a user
router.get('/:userId', TemplateController.getUserTemplates);

// Get a single template
router.get('/:userId/:templateId', TemplateController.getTemplate);

// Update a template
router.put('/:userId/:templateId', TemplateController.updateTemplate);

// Delete a template
router.delete('/:userId/:templateId', TemplateController.deleteTemplate);

export default router;

