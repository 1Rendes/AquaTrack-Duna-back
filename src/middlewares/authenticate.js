import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/sessions.js';
import { UserCollection } from '../db/models/users.js';
import { HTTP_STATUSES } from '../constants/index.js';

const { UNAUTHORIZED } = HTTP_STATUSES;

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(UNAUTHORIZED, 'Please provide Authorization header'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(UNAUTHORIZED, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await SessionCollection.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(UNAUTHORIZED, 'Session not found'));
    return;
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isSessionTokenExpired) {
    next(createHttpError(UNAUTHORIZED, 'Access token expired'));
    return;
  }

  const user = await UserCollection.findOne({ _id: session.userId });

  if (!user) {
    next(createHttpError(UNAUTHORIZED, 'Unauthorized'));
    return;
  }

  req.user = user;
  next();
};
