import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
  text: 'string',
});

export const Message = mongoose.model('Message', MessageSchema);
