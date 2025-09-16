import { Request, Response, NextFunction } from 'express';

// Validation middleware for user check endpoint
export const validateUserCheck = (req: Request, res: Response, next: NextFunction) => {
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

// Validation middleware for day plan endpoint
export const validateDayPlan = (req: Request, res: Response, next: NextFunction) => {
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

// Validation middleware for daily plan endpoint
export const validateDailyPlan = (req: Request, res: Response, next: NextFunction) => {
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

// Validation middleware for plan update
export const validatePlanUpdate = (req: Request, res: Response, next: NextFunction) => {
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

// Validation middleware for query parameters
export const validateQueryParams = (requiredParams: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
