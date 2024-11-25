import { WaterCollection } from '../db/models/water.js';

export const addWater = (payload) => WaterCollection.create(payload);

export const updateWater = async (waterId, userId, payload, options = {}) => {
  const water = await WaterCollection.findOneAndUpdate(
    {
      _id: waterId,
      userId,
    },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );

  return {
    data: water.value,
    isNew: Boolean(water?.lastErrorObject?.upserted),
  };
};

export const deleteWater = (waterId, userId) =>
  WaterCollection.findOneAndDelete({
    _id: waterId,
    userId,
  });

export const getDailyWater = (userId, date) => {
  const startOfDay = new Date(`${date}T00:00:00`).toISOString();
  const endOfDay = new Date(`${date}T23:59:59`).toISOString();
  return WaterCollection.find({
    userId,
    time: { $gte: startOfDay, $lte: endOfDay },
  });
};

import { format } from 'date-fns';

export const getMonthlyWater = async (userId, yearMonth) => {
  const startOfMonth = new Date(`${yearMonth}-01T00:00:00`);
  const endOfMonth = new Date(`${yearMonth}-31T23:59:59`);
  const waterRecords = await WaterCollection.find({
    userId,
    time: {
      $gte: startOfMonth.toISOString(),
      $lte: endOfMonth.toISOString(),
    },
  }).sort({ time: 1 });

  const dailyPercentages = {};

  waterRecords.forEach((record) => {
    const date = new Date(record.time);
    const formattedDay = format(date, 'yyyy-MM-dd');
    dailyPercentages[formattedDay] = record.percentage;
  });

  const daysInMonth = new Date(
    startOfMonth.getFullYear(),
    startOfMonth.getMonth() + 1,
    0,
  ).getDate();

  const result = Array.from({ length: daysInMonth }, (_, i) => {
    const formattedDay = format(
      new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), i + 1),
      'yyyy-MM-dd',
    );

    return {
      day: formattedDay,
      percentage: dailyPercentages[formattedDay] || 0,
    };
  });

  return result;
};
