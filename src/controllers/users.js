import createHttpError from 'http-errors';
import { patchCurrentUserData } from '../services/users.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { HTTP_STATUSES } from '../constants/index.js';

const { OK, NOT_FOUND } = HTTP_STATUSES;

export const getCurrentUserDataController = async (req, res) => {
  const currentUser = req.user;
  res.json({
    status: OK,
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
    throw createHttpError(NOT_FOUND, 'User not found');
  }

  res.json({
    status: OK,
    message: `Successfully patched user with id ${req.user._id}!`,
    data: currentUser,
  });
};
