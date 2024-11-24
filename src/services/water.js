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

export const deleteWater = async (waterId, userId) =>
  WaterCollection.findOneAndDelete({
    _id: waterId,
    userId,
  });
