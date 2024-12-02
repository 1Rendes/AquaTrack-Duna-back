import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserCollection } from '../db/models/users.js';
import { HTTP_STATUSES, SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { SessionCollection } from '../db/models/sessions.js';
import { createSession } from '../utils/createSession.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import { env } from '../utils/env.js';
import path from 'path';
import fs from 'node:fs/promises';
import { sendEmail } from '../utils/sendEmail.js';

const { CONFLICT, NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } =
  HTTP_STATUSES;

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

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user)
    throw createHttpError(NOT_FOUND, `User with email ${email} not found`);
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    { expiresIn: '15m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-pwd?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      INTERNAL_SERVER_ERROR,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ password, token }) => {
  try {
    const decoded = jwt.verify(token, env('JWT_SECRET'));
    const user = await UserCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });
    if (!user) throw createHttpError(NOT_FOUND, 'User not found');
    const encryptedPassword = await bcrypt.hash(password, 10);
    await UserCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );
    await SessionCollection.deleteOne({ userId: user._id });
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(UNAUTHORIZED, 'Token is expired or invalid.');
    }
    throw error;
  }
};
