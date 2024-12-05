import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';
import {
  addWater,
  deleteWater,
  getDailyWater,
  getMonthlyWater,
  updateWater,
} from '../services/water.js';

const { NOT_FOUND, CREATED, OK, NO_CONTENT } = HTTP_STATUSES;

export const addWaterController = async (req, res, next) => {
  const userId = req.user._id;

  const water = await addWater({ ...req.body, userId });

  res.status(CREATED).json({
    status: CREATED,
    message: 'Water added successfully',
    data: water,
  });
};

export const updateWaterController = async (req, res, next) => {
  const { waterId } = req.params;
  const userId = req.user._id;

  const water = await updateWater(waterId, userId, req.body);

  if (!water) {
    throw createHttpError(NOT_FOUND, 'Water not found');
  }

  const status = water?.isNew ? CREATED : OK;

  res.status(status).json({
    status: status,
    message: 'Water updated successfully',
    data: water,
  });
};

export const deleteWaterController = async (req, res, next) => {
  const { waterId } = req.params;
  const userId = req.user._id;

  const water = await deleteWater(waterId, userId);

  if (!water) {
    return next(createHttpError.NotFound('Water not found'));
  }

  res.status(NO_CONTENT).send();
};

export const getDailyWaterController = async (req, res, next) => {
  const { date } = req.params;
  const userId = req.user._id;

  const dailyWater = await getDailyWater(userId, date);

  if (!dailyWater) {
    return next(createHttpError(NOT_FOUND, `Water by date ${date} not found`));
  }

  res.status(OK).json({
    status: OK,
    message: `Water by date ${date} found successfully`,
    data: dailyWater,
  });
};

export const getMonthlyWaterController = async (req, res, next) => {
  const { yearMonth } = req.params;
  const userId = req.user._id;

  const monthlyWater = await getMonthlyWater(userId, yearMonth);
  if (!monthlyWater) {
    return next(
      createHttpError(NOT_FOUND, `Water by month ${yearMonth} not found`),
    );
  }

  res.status(OK).json({
    status: OK,
    message: `Water by month ${yearMonth} found successfully`,
    data: monthlyWater,
  });
};
