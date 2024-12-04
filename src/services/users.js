import { UserCollection } from '../db/models/users.js';

export const patchCurrentUserData = (_id, payload = {}) => {
  return UserCollection.findOneAndUpdate(
    {
      _id,
    },
    payload,
    { new: true },
  );
};
