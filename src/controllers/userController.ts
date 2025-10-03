import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';

export class UserController {
  /**
   * Verify Google ID token and authenticate user
   * POST /user/google-auth
   */
  static googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'Google ID token is required',
      });
    }

    try {
      // Verify token with Google's public endpoint
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      const tokenInfo: any = await response.json();

      if (!response.ok || tokenInfo.error) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Google token',
        });
      }

      // Extract user info from verified token
      const userId = tokenInfo.sub; // Google's unique user ID
      const email = tokenInfo.email;
      const name = tokenInfo.name || '';
      const avatarUrl = tokenInfo.picture;

      // Check if user exists or create new one
      const result = await UserService.checkOrCreateUser(email, userId, name);

      return res.json({
        success: true,
        user: {
          ...result.user,
          avatar_url: avatarUrl,
        },
        token: idToken, // You can generate your own JWT here if needed
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to verify Google token',
      });
    }
  });

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
