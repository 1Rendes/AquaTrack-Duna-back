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
    'string.base': 'Name must be a valid string.',
  }),
  email: Joi.string().email().messages({
    'string.empty': 'Email cannot be empty.',
    'string.email': 'Email must be a valid email address.',
    'string.base': 'Email must be a valid string.',
  }),
  weight: Joi.number().min(0).max(300).messages({
    'number.base': 'Weight must be a valid number.',
    'number.min': 'Weight must be at least 0.',
    'number.max': 'Weight must not exceed 300.',
  }),
  activityLevel: Joi.number().min(0).messages({
    'number.base': 'Activity level must be a valid number.',
    'number.min': 'Activity level cannot be negative.',
  }),
  gender: Joi.string().valid('male', 'female').messages({
    'string.empty': 'Gender cannot be empty.',
    'any.only': 'Gender must be either "male" or "female".',
    'string.base': 'Gender must be a valid string.',
  }),
  dailyRequirement: Joi.number().integer().min(1500).messages({
    'number.base': 'Daily requirement must be a valid number.',
    'number.integer': 'Daily requirement must be an integer.',
    'number.min': 'Daily requirement must be at least 1500.',
  }),
});
