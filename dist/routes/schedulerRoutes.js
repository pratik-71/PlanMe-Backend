"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schedulerController_1 = require("../controllers/schedulerController");
const router = (0, express_1.Router)();
router.post('/run-daily-check', schedulerController_1.SchedulerController.runDailyCheck);
router.get('/status', schedulerController_1.SchedulerController.getStatus);
exports.default = router;
//# sourceMappingURL=schedulerRoutes.js.map