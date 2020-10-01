const S3Mock = {
  getSignedUrlPromise: jest.fn(),
};

module.exports = {
  S3: jest.fn().mockImplementation(() => S3Mock),
  S3Mock,
};
