import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateUserCheck } from '../middleware/validation';

const router = Router();

// POST /user/check - Check if user exists, create if name provided
router.post('/check', validateUserCheck, UserController.checkUser);

// GET /user/:userId - Get user by ID
router.get('/:userId', UserController.getUserById);

// PUT /user/:userId - Update user
router.put('/:userId', UserController.updateUser);

// DELETE /user/:userId - Delete user
router.delete('/:userId', UserController.deleteUser);

export default router;
