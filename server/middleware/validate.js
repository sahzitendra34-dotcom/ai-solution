const { check, validationResult } = require('express-validator');

// Strips HTML tag brackets to prevent standard HTML reflection (XSS)
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const validateInquiry = [
  check('fullName', 'Full Name is required').notEmpty().trim().customSanitizer(sanitizeInput),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('phone', 'Please enter a valid phone number (min 7 digits, numbers/spaces/dashes only)')
    .notEmpty()
    .matches(/^\+?[0-9\s\-()]{7,20}$/),
  check('companyName').optional().trim().customSanitizer(sanitizeInput),
  check('country', 'Country is required').notEmpty().trim().customSanitizer(sanitizeInput),
  check('jobTitle').optional().trim().customSanitizer(sanitizeInput),
  check('jobDetails', 'Job details must be at least 10 characters long')
    .isLength({ min: 10 })
    .trim()
    .customSanitizer(sanitizeInput),
  
  // Middleware to check results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  check('username', 'Username is required').notEmpty().trim().escape(),
  check('password', 'Password is required').notEmpty(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateInquiry,
  validateLogin
};
