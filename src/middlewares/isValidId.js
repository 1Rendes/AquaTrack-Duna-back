import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import { HTTP_STATUSES } from '../constants/index.js';

export const isValidId =
  (idName = 'id') =>
  (req, res, next) => {
    const id = req.params[idName];

    if (!id) throw new Error('Id parameter not provided');

    if (!isValidObjectId(id))
      return next(
        createHttpError(HTTP_STATUSES.NOT_FOUND, 'Invalid Id format'),
      );

    return next();
  };
