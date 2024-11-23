import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserCollection } from '../db/models/users.js';
import { HTTP_STATUSES } from '../constants/index.js';
import { SessionCollection } from '../db/models/sessions.js';
import { createSession } from '../utils/createSession.js';

const { CONFLICT, NOT_FOUND, UNAUTHORIZED } = HTTP_STATUSES;

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(CONFLICT, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  const name = payload.email.split('@')[0];

  return UserCollection.create({
    ...payload,
    name,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(NOT_FOUND, 'User not found.');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(UNAUTHORIZED, 'Incorrect password.');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  const session = await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
  return { user, session };
};

export const logoutUser = async (sessionId) =>
  SessionCollection.deleteOne({ _id: sessionId });

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  console.log('sessionId', sessionId, 'refresh', refreshToken);
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(UNAUTHORIZED, 'Session not found');
  }

  const isRefreshTokenExpired = new Date() < session.refreshTokenValidUntil;

  if (!isRefreshTokenExpired) {
    throw createHttpError(UNAUTHORIZED, 'Session token expired');
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
