import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateUserCheck } from '../middleware/validation';

const router = Router();

// POST /user/google-auth - Verify Google token and authenticate
router.post('/google-auth', UserController.googleAuth);

// POST /user/check - Check if user exists, create if name provided
router.post('/check', validateUserCheck, UserController.checkUser);

// GET /user/:userId - Get user by ID
router.get('/:userId', UserController.getUserById);

// PUT /user/:userId - Update user
router.put('/:userId', UserController.updateUser);

// PUT /user/:userId/protein-goal - Update user's daily protein goal
router.put('/:userId/protein-goal', UserController.updateProteinGoal);

// Expense JSONB on User
router.get('/:userId/expense', UserController.getExpense);
router.put('/:userId/expense', UserController.updateExpense);

// DELETE /user/:userId - Delete user
router.delete('/:userId', UserController.deleteUser);

export default router;
