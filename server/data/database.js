import mongoose from 'mongoose';

export const connectDatabase = (url = process.env.DATABASE_URI) =>
  mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
