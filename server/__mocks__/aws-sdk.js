const s3Mock = {
  getSignedUrlPromise: jest.fn(),
};

module.exports = {
  S3: jest.fn().mockImplementation(() => s3Mock),
  s3Mock,
};
