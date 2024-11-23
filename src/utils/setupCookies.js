import { THIRTY_DAYS } from '../constants/index.js';

export const setupCookies = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    sameSite: 'None',
    secure: true,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    sameSite: 'None',
    secure: true,
  });
};
