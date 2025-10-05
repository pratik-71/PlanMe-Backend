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
UserController.googleAuth = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    console.log('=== GOOGLE AUTH START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const { idToken } = req.body;
    if (!idToken) {
        console.log('ERROR: No idToken provided');
        return res.status(400).json({
            success: false,
            error: 'Google ID token is required',
        });
    }
    console.log('idToken received, length:', idToken.length);
    console.log('idToken preview:', idToken.substring(0, 50) + '...');
    try {
        console.log('Calling Google tokeninfo endpoint...');
        const googleUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
        console.log('Google URL:', googleUrl);
        const response = await fetch(googleUrl);
        console.log('Google response status:', response.status);
        console.log('Google response ok:', response.ok);
        const tokenInfo = await response.json();
        console.log('Google tokenInfo:', JSON.stringify(tokenInfo, null, 2));
        if (!response.ok || tokenInfo.error) {
            console.log('ERROR: Google token verification failed');
            console.log('Response ok:', response.ok);
            console.log('Token error:', tokenInfo.error);
            return res.status(401).json({
                success: false,
                error: `Invalid Google token: ${tokenInfo.error || 'Token verification failed'}`,
            });
        }
        console.log('Google token verification successful');
        const googleUserId = tokenInfo.sub;
        const email = tokenInfo.email;
        const name = tokenInfo.name || '';
        const avatarUrl = tokenInfo.picture;
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update(googleUserId).digest('hex');
        const userId = `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
        console.log('Extracted user info:');
        console.log('- userId:', userId);
        console.log('- email:', email);
        console.log('- name:', name);
        console.log('- avatarUrl:', avatarUrl);
        console.log('Calling UserService.checkOrCreateUser...');
        const result = await userService_1.UserService.checkOrCreateUser(email, userId, name);
        console.log('UserService result:', JSON.stringify(result, null, 2));
        const responseData = {
            success: true,
            user: {
                ...result.user,
                avatar_url: avatarUrl,
            },
            token: idToken,
        };
        console.log('Sending success response:', JSON.stringify(responseData, null, 2));
        console.log('=== GOOGLE AUTH SUCCESS ===');
        return res.json(responseData);
    }
    catch (error) {
        console.log('ERROR in Google auth:', error);
        console.log('Error message:', error.message);
        console.log('Error stack:', error.stack);
        console.log('=== GOOGLE AUTH ERROR ===');
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to verify Google token',
        });
    }
});
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