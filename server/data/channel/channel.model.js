import mongoose, { Schema } from 'mongoose';

const channelSchema = new Schema(
  {
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    name: String,
    server: { type: Schema.Types.ObjectId, ref: 'Server' },
  },
  { timestamps: true }
);

export const Channel = mongoose.model('Channel', channelSchema);
