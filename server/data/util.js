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

export const findAuthUser = async ({ authorization, services }) => {
  const decodedToken = decodeToken(authorization);

  const authUser = decodedToken?.id
    ? await services.userService.findById(decodedToken.id)
    : null;

  return authUser;
};
