import { TokenExpiredError as ActualTokenExpiredError } from 'jsonwebtoken';

export const TokenExpiredError = ActualTokenExpiredError;

export default {
  decode: jest.fn((obj) => obj),
  sign: jest.fn((obj) => obj),
  verify: jest.fn(),
};
