import knex from 'knex';
import mockKnex from 'mock-knex';
import jwt from 'jsonwebtoken';

import { AuthDataSource } from './../auth.datasource';

import { TABLE_NAMES } from './../../constants';

const tracker = mockKnex.getTracker();

let auth;

beforeEach(() => {
  process.env.JWT_SECRET = 'supersecret';

  const dbClient = knex({
    client: 'postgres',
    connection: {
      host: 'localhost',
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    },
  });

  mockKnex.mock(dbClient);

  tracker.install();

  auth = new AuthDataSource(dbClient, TABLE_NAMES.USERS);

  auth.cache = {
    get: jest.fn(),
    set: jest.fn(),
  };
});

afterEach(() => {
  tracker.uninstall();
});

test('signs up a user', async (done) => {
  tracker.on('query', (query) => {
    expect(query.method).toBe('insert');
    expect(query.bindings).toContain('foo');
    expect(query.bindings).toContain('bar');
    expect(query.bindings).toContain('baz');

    done();
  });

  auth.signup({
    email: 'foo',
    password: 'bar',
    username: 'baz',
  });
});

test('throws the correct errors when signup fails', async (done) => {
  tracker.on('query', (query, step) => {
    const steps = [
      () => query.reject(new Error({ constraint: 'users_email_unique' })),
      () => query.reject(new Error({ constraint: 'users_username_unique' })),
    ];

    steps[step - 1]();
  });

  const user = {
    email: 'foo',
    password: 'bar',
    username: 'baz',
  };

  expect(async () => await auth.signup(user)).toThrow();
  expect(async () => await auth.signup(user)).toThrow();

  done();
});

test('generates a jwt', () => {
  const token = auth.generateJWT({ id: 'foo', username: 'bar' });
  const decoded = jwt.decode(token);

  expect(decoded.id).toBe('foo');
  expect(decoded.username).toBe('bar');
});

test('validates passwords', () => {
  expect(auth.validatePassword({ candidate: 'foo', password: 'foo' })).toBe(
    true
  );
  expect(auth.validatePassword({ candidate: 'foo', password: 'bar' })).toBe(
    false
  );
});
