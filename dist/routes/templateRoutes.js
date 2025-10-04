"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const templateController_1 = require("../controllers/templateController");
const router = (0, express_1.Router)();
router.post('/', templateController_1.TemplateController.createTemplate);
router.get('/:userId', templateController_1.TemplateController.getUserTemplates);
router.get('/:userId/:templateId', templateController_1.TemplateController.getTemplate);
router.put('/:userId/:templateId', templateController_1.TemplateController.updateTemplate);
router.delete('/:userId/:templateId', templateController_1.TemplateController.deleteTemplate);
exports.default = router;
//# sourceMappingURL=templateRoutes.js.map