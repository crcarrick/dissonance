const getMockFns = () => ({
  andWhere: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  join: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  whereIn: jest.fn().mockReturnThis(),
});

export default () => {
  let mock;

  const mockKnexFn = jest.fn(() => {
    if (!mock) {
      mock = getMockFns();
    }

    return mock;
  });

  mockKnexFn.transaction = jest.fn((cb) => cb(mock));

  return mockKnexFn;
};
