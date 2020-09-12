import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: 'string',
});

export const User = mongoose.model('User', UserSchema);
