import { Schema, model } from 'mongoose';

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    weight: {
      type: Number,
      default: null,
    },

    activityLevel: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'female',
    },

    dailyRequirement: {
      type: Number,
      default: 1500,
    },

    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserCollection = model('user', usersSchema);
