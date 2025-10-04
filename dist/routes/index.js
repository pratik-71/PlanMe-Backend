"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const dayPlanRoutes_1 = __importDefault(require("./dayPlanRoutes"));
const dailyPlanRoutes_1 = __importDefault(require("./dailyPlanRoutes"));
const schedulerRoutes_1 = __importDefault(require("./schedulerRoutes"));
const templateRoutes_1 = __importDefault(require("./templateRoutes"));
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Backend API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
router.use('/user', userRoutes_1.default);
router.use('/plan_day', dayPlanRoutes_1.default);
router.use('/scheduler', schedulerRoutes_1.default);
router.use('/templates', templateRoutes_1.default);
router.use('/', dailyPlanRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map