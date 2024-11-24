import { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split('.')[0],
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WaterCollection = model('water', waterSchema);
