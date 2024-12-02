import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { HTTP_STATUSES } from '../constants/index.js';
import { setupCookies } from '../utils/setupCookies.js';
import { clearCookies } from '../utils/cleareCookies.js';

const { CREATED, OK, NO_CONTENT } = HTTP_STATUSES;

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(CREATED).json({
    status: CREATED,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const { session, user } = await loginUser(req.body);

  setupCookies(res, session);

  res.status(OK).json({
    status: OK,
    message: 'Successfully logged in a user!',
    data: {
      user,
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  clearCookies(res);

  res.status(NO_CONTENT).send();
};

export const refreshUserSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshUserSession({ sessionId, refreshToken });

  setupCookies(res, session);

  res.status(OK).json({
    status: OK,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;
  await requestResetToken(email);

  res.json({
    status: HTTP_STATUSES.OK,
    message: `Reset password successfully sent to ${email}`,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    status: HTTP_STATUSES.OK,
    message: 'Password successfully changed',
    data: {},
  });
};
