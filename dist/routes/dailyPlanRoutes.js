"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dayPlanController_1 = require("../controllers/dayPlanController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.post('/addPlan', validation_1.validateDailyPlan, dayPlanController_1.DailyPlanController.addPlan);
router.get('/getAllPlansForDate', (0, validation_1.validateQueryParams)(['userId', 'date']), dayPlanController_1.DailyPlanController.getAllPlansForDate);
router.put('/updatePlan', validation_1.validatePlanUpdate, dayPlanController_1.DailyPlanController.updatePlan);
router.get('/daily-plans/:userId', dayPlanController_1.DailyPlanController.getUserDailyPlans);
exports.default = router;
//# sourceMappingURL=dailyPlanRoutes.js.map