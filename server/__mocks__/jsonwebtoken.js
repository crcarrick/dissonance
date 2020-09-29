const { TokenExpiredError } = require('jsonwebtoken');

module.exports = {
  decode: jest.fn((obj) => obj),
  sign: jest.fn((obj) => obj),
  verify: jest.fn(),
  TokenExpiredError,
};
