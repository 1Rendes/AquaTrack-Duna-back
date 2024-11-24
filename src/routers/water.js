import { Router } from 'express';
import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { addWaterSchema, updateWaterSchema } from '../validation/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  addWaterController,
  deleteWaterController,
  updateWaterController,
} from '../controllers/water.js';

const router = Router();
const jsonParser = express.json();
router.post(
  '/',
  jsonParser,
  validateBody(addWaterSchema),
  ctrlWrapper(addWaterController),
);

router.patch(
  '/:waterId',
  jsonParser,
  isValidId('waterId'),
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterController),
);

router.delete(
  '/:waterId',
  jsonParser,
  isValidId('waterId'),
  ctrlWrapper(deleteWaterController),
);

//Ще мають бути 2 роути для отримання масиву порцій за день і за місяць

export default router;
