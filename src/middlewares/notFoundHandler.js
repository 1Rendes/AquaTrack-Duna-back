import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';

export const notFoundHandler = (req, res, next) => {
  next(createHttpError(HTTP_STATUSES.NOT_FOUND, 'Route not found')); //Потрапить в наступну міддлвару errorHandler
};
