import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must be at most 30 characters long',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(18).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password must be at most 18 characters long',
    'any.required': 'Password is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(18).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password must be at most 18 characters long',
    'any.required': 'Password is required',
  }),
});

export function validateRegister(req, res, next) {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation error during registration',
      errors: error.details.map((detail) => detail.message),
    });
  }
  req.body = value;
  next();
}

export function validateLogin(req, res, next) {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation error during login',
      errors: error.details.map((detail) => detail.message),
    });
  }
  req.body = value;
  next();
}