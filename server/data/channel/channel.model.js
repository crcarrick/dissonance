import mongoose, { Schema } from 'mongoose';

const ChannelSchema = new Schema({
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  name: 'string',
  server: { type: Schema.Types.ObjectId, ref: 'Server' },
});

export const Channel = mongoose.model('Channel', ChannelSchema);
