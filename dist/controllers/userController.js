"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const errorHandler_1 = require("../middleware/errorHandler");
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.checkUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { user_id, name, email } = req.body;
    const result = await userService_1.UserService.checkOrCreateUser(email, user_id, name);
    res.json(result);
});
UserController.getUserById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'User ID is required',
        });
    }
    const user = await userService_1.UserService.getUserById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found',
        });
    }
    return res.json({
        success: true,
        user,
    });
});
UserController.updateUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'User ID is required',
        });
    }
    const user = await userService_1.UserService.updateUser(userId, updates);
    return res.json({
        success: true,
        message: 'User updated successfully',
        user,
    });
});
UserController.deleteUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            success: false,
            error: 'User ID is required',
        });
    }
    await userService_1.UserService.deleteUser(userId);
    return res.json({
        success: true,
        message: 'User deleted successfully',
    });
});
//# sourceMappingURL=userController.js.map