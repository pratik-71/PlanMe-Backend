"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryParams = exports.validatePlanUpdate = exports.validateDailyPlan = exports.validateDayPlan = exports.validateUserCheck = void 0;
const validateUserCheck = (req, res, next) => {
    const { user_id, email, name } = req.body;
    if (!email) {
        return res.status(400).json({
            error: 'Email is required',
            field: 'email'
        });
    }
    if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({
            error: 'Valid email is required',
            field: 'email'
        });
    }
    if (user_id && typeof user_id !== 'string') {
        return res.status(400).json({
            error: 'User ID must be a string',
            field: 'user_id'
        });
    }
    if (name && (typeof name !== 'string' || name.trim().length < 2)) {
        return res.status(400).json({
            error: 'Name must be at least 2 characters long',
            field: 'name'
        });
    }
    return next();
};
exports.validateUserCheck = validateUserCheck;
const validateDayPlan = (req, res, next) => {
    const { userId, dayName, selectedDate, timeSlots } = req.body;
    if (!userId) {
        return res.status(400).json({
            error: 'User ID is required',
            field: 'userId'
        });
    }
    if (!dayName) {
        return res.status(400).json({
            error: 'Day name is required',
            field: 'dayName'
        });
    }
    if (!selectedDate) {
        return res.status(400).json({
            error: 'Selected date is required',
            field: 'selectedDate'
        });
    }
    if (!timeSlots || !Array.isArray(timeSlots)) {
        return res.status(400).json({
            error: 'Time slots must be an array',
            field: 'timeSlots'
        });
    }
    return next();
};
exports.validateDayPlan = validateDayPlan;
const validateDailyPlan = (req, res, next) => {
    const { userId, planName, planDate, reminders } = req.body;
    if (!userId) {
        return res.status(400).json({
            error: 'User ID is required',
            field: 'userId'
        });
    }
    if (!planName) {
        return res.status(400).json({
            error: 'Plan name is required',
            field: 'planName'
        });
    }
    if (!planDate) {
        return res.status(400).json({
            error: 'Plan date is required',
            field: 'planDate'
        });
    }
    if (!reminders || !Array.isArray(reminders)) {
        return res.status(400).json({
            error: 'Reminders must be an array',
            field: 'reminders'
        });
    }
    return next();
};
exports.validateDailyPlan = validateDailyPlan;
const validatePlanUpdate = (req, res, next) => {
    const { planId, reminders } = req.body;
    if (!planId) {
        return res.status(400).json({
            error: 'Plan ID is required',
            field: 'planId'
        });
    }
    if (!reminders || !Array.isArray(reminders)) {
        return res.status(400).json({
            error: 'Reminders must be an array',
            field: 'reminders'
        });
    }
    return next();
};
exports.validatePlanUpdate = validatePlanUpdate;
const validateQueryParams = (requiredParams) => {
    return (req, res, next) => {
        const missingParams = requiredParams.filter(param => !req.query[param]);
        if (missingParams.length > 0) {
            return res.status(400).json({
                error: `Missing required query parameters: ${missingParams.join(', ')}`,
                missing: missingParams
            });
        }
        return next();
    };
};
exports.validateQueryParams = validateQueryParams;
//# sourceMappingURL=validation.js.map