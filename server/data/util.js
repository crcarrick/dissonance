import { ApolloError, AuthenticationError } from 'apollo-server';
import aws from 'aws-sdk';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { merge } from 'lodash';
import mime from 'mime-types';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { TABLE_NAMES } from './constants';

export const createConfig = (config) => {
  return {
    typeDefs: config.typeDefs.join(' '),
    resolvers: merge({}, ...config.resolvers),
    ...config,
  };
};

export const createSignedUrl = async (fileName) => {
  const s3 = new aws.S3();

  const ContentType = mime.lookup(path.extname(fileName));
  const Key = uuidv4();

  if (!ContentType.startsWith('image')) {
    throw new ApolloError('File is not an image type', 'FILE_TYPE_MISMATCH');
  }

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key,
    Expires: 60,
    ContentType,
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${Key}`;

    return {
      signedUrl,
      url,
    };
  } catch (err) {
    throw new ApolloError('Something went wrong', 'INTERNAL_SERVER_ERROR');
  }
};

export const decodeToken = (authorization) => {
  if (authorization) {
    const token = authorization.replace('Bearer ', '');

    return jwt.verify(token, process.env.JWT_SECRET);
  }
};

export const findAuthUser = async ({ authorization, dbClient }) => {
  try {
    const decodedToken = decodeToken(authorization);

    const authUser = decodedToken?.id
      ? await dbClient(TABLE_NAMES.USERS)
          .where('id', decodedToken.id)
          .select()
          .first()
      : null;

    return authUser;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthenticationError('Token expired');
    } else {
      throw error;
    }
  }
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
