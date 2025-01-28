import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateChallenge = [
  body('title').trim().notEmpty().withMessage('Challenge title is required'),
  body('description').trim().notEmpty().withMessage('Challenge description is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('skillsNeeded').isArray().withMessage('Skills needed must be an array'),
  body('seniorityLevel').isIn(['Junior', 'Intermediate', 'Senior']).withMessage('Invalid seniority level'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('prize.min').isInt({ min: 0 }).withMessage('Minimum prize must be a non-negative integer'),
  body('prize.max').isInt({ min: 0 }).withMessage('Maximum prize must be a non-negative integer'),
  body('status').optional().isIn(['Open', 'Closed', 'Completed']).withMessage('Invalid status'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


export const validateSubmission = [
    body('content').trim().notEmpty().withMessage('Submission content is required'),
    body('attachments').optional().isArray().withMessage('Attachments must be an array of strings'),
  
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];
  
  export const validateSubmissionUpdate = [
    body('status').optional().isIn(['Pending', 'Approved', 'Rejected']).withMessage('Invalid status'),
    body('feedback').optional().trim().notEmpty().withMessage('Feedback cannot be empty'),
  
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];