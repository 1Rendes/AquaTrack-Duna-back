import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.empty': 'Name cannot be empty.',
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name must not exceed 20 characters.',
  }),
  email: Joi.string().email().messages({
    'string.empty': 'Email cannot be empty.',
    'string.email': 'Email must be a valid email address.',
  }),
  weight: Joi.number().messages({
    'number.base': 'Weight must be a valid number.',
  }),
  activityLevel: Joi.number().messages({
    'number.base': 'Activity level must be a valid number.',
  }),
  gender: Joi.string().valid('male', 'female').messages({
    'string.empty': 'Gender cannot be empty.',
    'any.only': 'Gender must be either "male" or "female".',
  }),
  dailyRequirement: Joi.number().integer().messages({
    'number.base': 'Daily requirement must be a valid number.',
    'number.integer': 'Daily requirement must be an integer.',
  }),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'The email must be a valid string.',
    'string.email': 'The email must be a valid email address.',
    'any.required': 'The email is required.',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    'string.base': 'The password must be a valid string.',
    'any.required': 'The password is required.',
  }),
  token: Joi.string().required().messages({
    'string.base': 'The token must be a valid string.',
    'any.required': 'The token is required.',
  }),
});
