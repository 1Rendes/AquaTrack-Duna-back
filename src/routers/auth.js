import { Router } from 'express';
import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { userSchema } from '../validation/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/auth.js';

const router = Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(userSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(userSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
