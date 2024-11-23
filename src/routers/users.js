import { Router } from 'express';
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getCurrentUserDataController,
  patchCurrentUserDataController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateUserSchema } from '../validation/users.js';
import { upload } from '../middlewares/multer.js';

const router = Router();
const jsonParser = express.json();

router.use(authenticate);

router.get('/current', ctrlWrapper(getCurrentUserDataController));

router.patch(
  '/current',
  jsonParser,
  upload.single('photo'),
  validateBody(updateUserSchema),
  ctrlWrapper(patchCurrentUserDataController),
);

export default router;
