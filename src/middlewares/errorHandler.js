import { isHttpError } from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';
import { MongooseError } from 'mongoose';

const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = HTTP_STATUSES;

export const errorHandler = (error, req, res, next) => {
  const formatErrorResponse = (status, message, data = {}) => {
    res.status(status).json({
      status,
      message,
      data,
    });
  };
  if (isHttpError(error)) {
    formatErrorResponse(error.status, error.name, { ...error });
    return;
  }
  if (error instanceof SyntaxError && 'body' in error) {
    formatErrorResponse(BAD_REQUEST, 'Invalid JSON format', {
      message: error.body,
    });
    return;
  }

  if (error instanceof MongooseError) {
    formatErrorResponse(INTERNAL_SERVER_ERROR, 'Mongoose error', {
      message: error.message,
    });
    return;
  }
  formatErrorResponse(INTERNAL_SERVER_ERROR, 'Something went wrong', {
    message: error.message || 'Unknown error',
  });
};
