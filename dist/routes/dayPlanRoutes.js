"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dayPlanController_1 = require("../controllers/dayPlanController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.post('/', validation_1.validateDayPlan, dayPlanController_1.DayPlanController.saveDayPlan);
router.get('/:userId', dayPlanController_1.DayPlanController.getUserDayPlans);
router.get('/detail/:planId', dayPlanController_1.DayPlanController.getDayPlan);
router.put('/:planId', dayPlanController_1.DayPlanController.updateDayPlan);
router.delete('/:planId', dayPlanController_1.DayPlanController.deleteDayPlan);
exports.default = router;
//# sourceMappingURL=dayPlanRoutes.js.map