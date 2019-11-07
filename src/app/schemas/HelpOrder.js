import mongoose from 'mongoose';

const HelpOrderSchema = new mongoose.Schema(
  {
    user: {
      type: Number,
      required: true,
    },
    question_content: {
      type: String,
      required: true,
    },
    answer_content: {
      type: String,
      required: false,
    },
    answer_at: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('HelpOrder', HelpOrderSchema);
