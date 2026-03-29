const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

const authValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
  ],
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required'),
    validate
  ]
};

const taskValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),
    body('description')
      .optional()
      .trim(),
    body('status')
      .optional()
      .isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status value'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
    body('dueDate')
      .optional()
      .isISO8601().withMessage('Invalid date format'),
    validate
  ],
  update: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid task ID'),
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Title cannot be empty')
      .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),
    body('description')
      .optional()
      .trim(),
    body('status')
      .optional()
      .isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status value'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
    body('dueDate')
      .optional()
      .isISO8601().withMessage('Invalid date format'),
    validate
  ],
  getById: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid task ID'),
    validate
  ],
  delete: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid task ID'),
    validate
  ]
};

module.exports = {
  validate,
  authValidation,
  taskValidation
};
