import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';

export class UserController {
  /**
   * Check if user exists, create if name provided
   * POST /user/check
   */
  static checkUser = asyncHandler(async (req: Request, res: Response) => {
    const { user_id, name, email } = req.body;

    const result = await UserService.checkOrCreateUser(email, user_id, name);

    res.json(result);
  });

  /**
   * Get user by ID
   * GET /user/:userId
   */
  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const user = await UserService.getUserById(userId);

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

  /**
   * Update user
   * PUT /user/:userId
   */
  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updates = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const user = await UserService.updateUser(userId, updates);

    return res.json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  });

  /**
   * Delete user
   * DELETE /user/:userId
   */
  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    await UserService.deleteUser(userId);

    return res.json({
      success: true,
      message: 'User deleted successfully',
    });
  });
}
