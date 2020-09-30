import { AuthenticationError } from 'apollo-server';
import aws from 'aws-sdk';
import mime from 'mime-types';
import knex from 'knex';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { createSignedUrl, findAuthUser } from '@dissonance/utils';

describe('Utils', () => {
  describe('createSignedUrl', () => {
    beforeAll(() => {
      process.env.S3_BUCKET = 'test_bucket';
    });

    test('creates an s3 signed url', async () => {
      const ContentType = 'image/png';
      const Key = '1234';
      const signedUrl = 'www.test.com';
      const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${Key}`;

      aws.s3Mock.getSignedUrlPromise.mockReturnValueOnce(signedUrl);
      mime.lookup.mockReturnValueOnce(ContentType);
      uuidv4.mockReturnValueOnce(Key);

      const expected = await createSignedUrl('test.png');

      expect(aws.s3Mock.getSignedUrlPromise.mock.calls[0][0]).toBe('putObject');
      expect(aws.s3Mock.getSignedUrlPromise.mock.calls[0][1]).toEqual({
        Bucket: process.env.S3_BUCKET,
        Key,
        Expires: 60,
        ContentType,
      });
      expect(expected).toEqual({
        signedUrl,
        url,
      });
    });

    test('throws if the file is not an image', async () => {
      mime.lookup.mockReturnValueOnce('application/pdf');

      await expect(() => createSignedUrl('test.pdf')).rejects.toThrow(
        'File is not an image type'
      );
    });
  });

  describe('findAuthUser', () => {
    const user = { id: '1' };

    let dbClient;
    beforeAll(() => {
      dbClient = knex({});
    });

    test('finds authenticated user using the token', async () => {
      jwt.verify.mockReturnValueOnce(user);
      dbClient().first.mockReturnValueOnce(user);

      const expected = await findAuthUser({
        authorization: 'Bearer 1234',
        dbClient,
      });

      expect(dbClient().where.mock.calls[0][1]).toBe(user.id);
      expect(expected).toEqual(user);
    });

    test('throws an AuthenticationError if the token is expired', async () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new TokenExpiredError();
      });

      await expect(() =>
        findAuthUser({ authorization: 'Bearer 1234', dbClient })
      ).rejects.toThrow(AuthenticationError);
    });
  });
});
