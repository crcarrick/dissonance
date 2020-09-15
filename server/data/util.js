import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { merge } from 'lodash';

export const createConfig = (config) => {
  return {
    typeDefs: config.typeDefs.join(' '),
    resolvers: merge({}, ...config.resolvers),
    ...config,
  };
};

export const decodeToken = (authorization) => {
  if (authorization) {
    const token = authorization.replace('Bearer ', '');

    return jwt.verify(token, process.env.JWT_SECRET);
  }
};

export const findAuthUser = async (token) => {
  const User = mongoose.model('User');

  const decodedToken = decodeToken(token);

  const authUser = decodedToken?.id
    ? await User.findById(decodedToken.id)
    : null;

  return authUser;
};

export const idResolver = {
  id: (model) => model._id,
};
