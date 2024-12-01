import Joi from 'joi';

const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

export const addWaterSchema = Joi.object({
  amount: Joi.number().integer().min(50).required().messages({
    'number.base': 'The amount must be a valid number.',
    'number.integer': 'The amount must be an integer.',
    'number.min': 'The amount cannot be less than 50.',
    'any.required': 'The amount is required.',
  }),

  time: Joi.string().pattern(isoDateTimePattern).required().messages({
    'string.base': 'The time must be a valid string.',
    'string.pattern.base':
      'The time must follow the ISO format (YYYY-MM-DDThh:mm:ss).',
    'any.required': 'The time is required.',
  }),
  percentage: Joi.number().integer().min(0).max(100).required().messages({
    'number.base': 'The percentage must be a valid number.',
    'number.integer': 'The percentage must be an integer.',
    'number.min': 'The percentage cannot be less than 0.',
    'number.max': 'The percentage cannot be greater than 100.',
    'any.required': 'The percentage is required.',
  }),
});

export const updateWaterSchema = Joi.object({
  amount: Joi.number().integer().min(50).messages({
    'number.base': 'The amount must be a valid number.',
    'number.integer': 'The amount must be an integer.',
    'number.min': 'The amount cannot be less than 50.',
  }),

  time: Joi.string().pattern(isoDateTimePattern).messages({
    'string.base': 'The time must be a valid string.',
    'string.pattern.base':
      'The time must follow the ISO format (YYYY-MM-DDThh:mm:ss).',
  }),
  percentage: Joi.number().integer().min(0).max(100).messages({
    'number.base': 'The percentage must be a valid number.',
    'number.integer': 'The percentage must be an integer.',
    'number.min': 'The percentage cannot be less than 0.',
    'number.max': 'The percentage cannot be greater than 100.',
  }),
});

//Для валідації динамічних параметрів запиту
//Треба буде додати для цього міддлварку

export const dateSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base':
        'The dynamic parameter which corresponds to date must be in the format YYYY-MM-DD.',
      'any.required': 'The date is required.',
    }),
});

export const monthSchema = Joi.object({
  yearMonth: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base':
        'The dynamic parameter which corresponds to month must be in the format YYYY-MM.',
      'any.required': 'The month is required.',
    }),
});
