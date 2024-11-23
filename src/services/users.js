import { UserCollection } from '../db/models/users.js';

//UsersServices
export const getCurrentUserData = (userId) => UserCollection.findById(userId);

export const patchCurrentUserData = (_id, payload = {}) => {
  return UserCollection.findOneAndUpdate(
    {
      _id,
    },
    payload,
    { new: true },
  );
};
