import { ApolloError } from 'apollo-server';
import aws from 'aws-sdk';
import mime from 'mime-types';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
