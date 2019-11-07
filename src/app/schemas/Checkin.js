import mongoose from 'mongoose';

const CheckinSchema = new mongoose.Schema(
  {
    user: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Checkin', CheckinSchema);
