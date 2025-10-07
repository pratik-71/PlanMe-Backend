import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';

export class UserController {
  /**
   * Verify Google ID token and authenticate user
   * POST /user/google-auth
   */
  static googleAuth = asyncHandler(async (req: Request, res: Response) => {
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
      
      const tokenInfo: any = await response.json();
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
      
      // Extract user info from verified token
      const googleUserId = tokenInfo.sub; // Google's unique user ID
      const email = tokenInfo.email;
      const name = tokenInfo.name || '';
      const avatarUrl = tokenInfo.picture;
      
      // Use the Google user ID directly as the user_id (Supabase will handle the auth)
      const userId = googleUserId;

      console.log('Extracted user info:');
      console.log('- userId:', userId);
      console.log('- email:', email);
      console.log('- name:', name);
      console.log('- avatarUrl:', avatarUrl);

      // Check if user exists or create new one
      console.log('Calling UserService.checkOrCreateUser...');
      const result = await UserService.checkOrCreateUser(email, userId, name);
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
    } catch (error: any) {
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

  /**
   * Update user's daily protein goal
   * PUT /user/:userId/protein-goal
   */
  static updateProteinGoal = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { protein_goal } = req.body as { protein_goal?: number };

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    if (protein_goal === undefined || protein_goal === null || Number.isNaN(Number(protein_goal))) {
      return res.status(400).json({ success: false, error: 'protein_goal (number) is required' });
    }

    const updated = await UserService.updateUser(userId, { protein_goal: Number(protein_goal) });
    return res.json({ success: true, message: 'Protein goal updated', user: updated });
  });
}
