import createHttpError from 'http-errors';
import { getCurrentUserData, patchCurrentUserData } from '../services/users.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getCurrentUserDataController = async (req, res) => {
  const currentUser = await getCurrentUserData(req.user._id);
  if (!currentUser) {
    throw createHttpError(404, 'User not found');
  }
  res.json({
    status: 200,
    message: `Successfully found user with id ${req.user._id}!`,
    data: currentUser,
  });
};

export const patchCurrentUserDataController = async (req, res) => {
  const photo = req.file;
  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const currentUser = await patchCurrentUserData(req.user._id, {
    ...req.body,
    photo: photoUrl,
  });

  if (!currentUser) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched user with id ${req.user._id}!`,
    data: currentUser,
  });
};
