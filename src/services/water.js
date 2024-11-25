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

export const getMonthlyWater = async (userId, yearMonth) => {
  const startOfMonth = new Date(`${yearMonth}-01T00:00:00`).toISOString();
  const endOfMonth = new Date(`${yearMonth}-31T23:59:59`).toISOString();
  const waterRecords = await WaterCollection.find({
    userId,
    time: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  }).sort({ time: 1 });

  const dailyPercentages = {};

  waterRecords.forEach((record) => {
    const day = new Date(record.time).getDate();
    dailyPercentages[day] = record.percentage;
  });

  const daysInMonth = new Date(
    startOfMonth.getFullYear(),
    startOfMonth.getMonth() + 1,
    0,
  ).getDate();
  const result = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    percentage: dailyPercentages[i + 1] || 0,
  }));

  return result;
};
