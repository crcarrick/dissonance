import jwt from 'jsonwebtoken';
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

export const findAuthUser = async ({ authorization, userService }) => {
  const decodedToken = decodeToken(authorization);

  const authUser = decodedToken?.id
    ? await userService.findById(decodedToken.id)
    : null;

  return authUser;
};

export const mapTo = (keys, keyFn) => (rows) => {
  const group = new Map(keys.map((key) => [key, null]));

  rows.forEach((row) => group.set(keyFn(row), row));

  return Array.from(group.values());
};

export const mapToMany = (keys, keyFn) => (rows) => {
  const group = new Map(keys.map((key) => [key, []]));

  rows.forEach((row) => (group.get(keyFn(row)) || []).push(row));

  return Array.from(group.values());
};
