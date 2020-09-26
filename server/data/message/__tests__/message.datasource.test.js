import { ForbiddenError } from 'apollo-server';
import knex from 'knex';
import mockKnex from 'mock-knex';

import { MESSAGE_ADDED_EVENT, TABLE_NAMES } from './../../constants';
import { MessageDataSource } from './../message.datasource';

describe('MessageDataSource', () => {
  const tracker = mockKnex.getTracker();
  const message1 = {
    id: '1',
    text: 'foo',
    authorId: '1',
    channelId: '1',
  };
  const message2 = {
    id: '2',
    text: 'bar',
    authorId: '1',
    channelId: '2',
  };
  const message3 = {
    id: '3',
    text: 'baz',
    authorId: '1',
    channelId: '3',
  };

  let messages;
  beforeEach(() => {
    const dbClient = knex({
      client: 'postgres',
      connection: '',
      useNullAsDefault: false,
    });

    mockKnex.mock(dbClient);

    messages = new MessageDataSource(dbClient, TABLE_NAMES.MESSAGES);

    messages.initialize({
      cache: {},
      context: {
        pubsub: {
          publish: jest.fn(),
        },
        user: { id: '1' },
      },
    });
  });

  describe('gets', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('messages by channel', async () => {
      tracker.on('query', (query) => {
        query.response([message3, message2, message1]);
      });

      const [result1] = await messages.getByChannel(message1.channelId);
      const [result2] = await messages.getByChannel(message2.channelId);
      const [result3] = await messages.getByChannel(message3.channelId);

      expect(result1).toEqual(message1);
      expect(result2).toEqual(message2);
      expect(result3).toEqual(message3);
    });
  });

  describe('creates', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('new messages if authorized', async () => {
      tracker.on('query', (query, step) => {
        const authorizedResponse = () => query.response([true]);
        const insertResponse = () => query.response([message1]);

        const steps = [authorizedResponse, insertResponse];

        if (step === 2) {
          expect(query.method).toBe('insert');
          expect(query.bindings).toContain(message1.text);
          expect(query.bindings).toContain(message1.channelId);
          expect(query.bindings).toContain(message1.authorId);
        }

        steps[step - 1]();
      });

      const expected = await messages.create({
        text: message1.text,
        channelId: message1.channelId,
      });

      expect(expected).toEqual(message1);
    });

    test('throws the correct errors if not authorized', async () => {
      tracker.on('query', (query) => {
        query.response([false]);
      });

      await expect(
        messages.create({ text: message1.text, channelId: message1.channelId })
      ).rejects.toThrow(ForbiddenError);
    });

    test('publishes new messages to subscriptions', async () => {
      tracker.on('query', (query, step) => {
        const authorizedResponse = () => query.response([true]);
        const insertResponse = () => query.response([message1]);

        const steps = [authorizedResponse, insertResponse];

        steps[step - 1]();
      });

      await messages.create({
        text: message1.text,
        channelId: message1.channelId,
      });

      expect(
        messages.context.pubsub.publish
      ).toHaveBeenCalledWith(MESSAGE_ADDED_EVENT, { messageAdded: message1 });
    });
  });
});
