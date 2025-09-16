"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.post('/check', validation_1.validateUserCheck, userController_1.UserController.checkUser);
router.get('/:userId', userController_1.UserController.getUserById);
router.put('/:userId', userController_1.UserController.updateUser);
router.delete('/:userId', userController_1.UserController.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map