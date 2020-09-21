import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
    text: String,
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
