import mongoose, { Schema } from 'mongoose';

const ServerSchema = new Schema({
  name: 'string',
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
});

ServerSchema.statics.createWithChannel = async function ({ name }) {
  const Channel = mongoose.model('Channel');

  const server = await Server.create({ name });
  const channel = await Channel.create({ name: 'general', server: server._id });

  return Server.findByIdAndUpdate(
    server._id,
    { $push: { channels: channel._id } },
    { new: true, useFindAndModify: false }
  );
};

export const Server = mongoose.model('Server', ServerSchema);
