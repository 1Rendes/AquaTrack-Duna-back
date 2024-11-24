import { Router } from 'express';
import usersRouter from './users.js';
import waterRouter from './water.js';
import authRouter from './auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/water', authenticate, waterRouter);

export default router;
