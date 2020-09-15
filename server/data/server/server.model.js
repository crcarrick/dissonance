import mongoose, { Schema } from 'mongoose';

const serverSchema = new Schema(
  {
    name: String,
    channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Server = mongoose.model('Server', serverSchema);
