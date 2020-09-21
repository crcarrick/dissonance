import mongoose, { Schema } from 'mongoose';

const serverSchema = new Schema(
  {
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

serverSchema.pre('save', async function (next) {
  if (this.isNew) {
    await mongoose.model('Channel').create([
      {
        name: 'welcome',
        server: this._id,
      },
      {
        name: 'general',
        server: this._id,
      },
    ]);

    await mongoose
      .model('User')
      .findByIdAndUpdate(this.owner, { $push: { servers: this._id } });

    next();
  }

  next();
});

serverSchema.post(
  'findOneAndDelete',
  { document: true, query: false },
  async function () {
    const Channel = mongoose.model('Channel');
    const User = mongoose.model('User');

    await Channel.deleteMany({ server: this._id });
    await User.updateMany(
      { servers: { $in: [this._id] } },
      { $pull: { servers: this._id } }
    );
  }
);

export const Server = mongoose.model('Server', serverSchema);
