import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errorMessages =
      error.details?.map((detail) => detail.message).join(', ') ||
      'Validation error';

    next(
      createHttpError(HTTP_STATUSES.BAD_REQUEST, 'Invalid request body', {
        errors: errorMessages,
      }),
    );
  }
};
