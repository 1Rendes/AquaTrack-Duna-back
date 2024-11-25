import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';

const { BAD_REQUEST } = HTTP_STATUSES;

export const validateParams = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.details?.map((detail) => detail.message);
    next(
      createHttpError(
        BAD_REQUEST,
        'Bad request: URL dynamic parameter is incorrect',
        {
          errors,
        },
      ),
    );
  }
};
