const S3Mock = {
  getSignedUrlPromise: jest.fn(),
};

export default {
  S3: jest.fn().mockImplementation(() => S3Mock),
  S3Mock,
};
