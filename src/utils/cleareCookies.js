export const clearCookies = (res) => {
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
};
