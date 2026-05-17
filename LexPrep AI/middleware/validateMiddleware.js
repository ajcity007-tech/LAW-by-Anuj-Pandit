const { body, param, query, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateBook = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  handleValidationErrors
];

const validateTopic = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  handleValidationErrors
];

const validateNote = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  handleValidationErrors
];

const validateQuestion = [
  body('type').isIn(['mcq', 'short', 'long', 'case_study']).withMessage('Valid question type is required'),
  body('question').trim().notEmpty().withMessage('Question text is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  handleValidationErrors
];

const validateAIChat = [
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('message').isLength({ max: 2000 }).withMessage('Message must be under 2000 characters'),
  handleValidationErrors
];

const validateExamSubmit = [
  body('test_id').notEmpty().withMessage('Test ID is required'),
  body('answers').isArray().withMessage('Answers must be an array'),
  handleValidationErrors
];

const validateIdParam = [
  param('id').isUUID().withMessage('Valid UUID is required'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateBook,
  validateTopic,
  validateNote,
  validateQuestion,
  validateAIChat,
  validateExamSubmit,
  validateIdParam
};
