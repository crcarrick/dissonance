import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export * from './channel';
export * from './message';
export * from './server';
export * from './user';
