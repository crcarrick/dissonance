import mongoose, { Schema } from 'mongoose';

const channelSchema = new Schema(
  {
    name: String,
    server: { type: Schema.Types.ObjectId, ref: 'Server' },
  },
  { timestamps: true }
);

channelSchema.post(
  'deleteMany',
  { document: true, query: false },
  async function () {
    await mongoose.model('Message').deleteMany({ channel: this._id });
  }
);

export const Channel = mongoose.model('Channel', channelSchema);
