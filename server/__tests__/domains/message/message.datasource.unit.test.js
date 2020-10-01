import { ForbiddenError } from 'apollo-server';
import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';
import {
  MESSAGE_ADDED_EVENT,
  MessageDataSource,
} from '@dissonance/domains/message';
import { messageMock } from '@dissonance/test-utils';

describe('MessageDataSource', () => {
  const message1 = messageMock();
  const message2 = messageMock();
  const message3 = messageMock();
  const message4 = messageMock({ channelId: message3.channelId });

  let dbClient;
  let messages;
  beforeEach(() => {
    dbClient = knex({});

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
    test('messages by channel using a dataloader', async () => {
      dbClient().select.mockResolvedValueOnce([
        message4,
        message3,
        message2,
        message1,
      ]);

      const expected = await Promise.all([
        messages.getByChannel(message1.channelId),
        messages.getByChannel(message2.channelId),
        messages.getByChannel(message3.channelId),
      ]);

      expect(dbClient().select).toHaveBeenCalledTimes(1);

      expect(expected).toEqual(
        expect.arrayContaining([
          [message1],
          [message2],
          expect.arrayContaining([message3, message4]),
        ])
      );
    });
  });

  describe('creates', () => {
    test('new messages if authorized', async () => {
      dbClient().first.mockReturnValueOnce(true);
      dbClient().returning.mockReturnValueOnce([message1]);

      const expected = await messages.create({
        channelId: message1.channelId,
        text: message1.text,
      });

      expect(dbClient().insert).toHaveBeenCalledWith({
        authorId: messages.context.user.id,
        channelId: message1.channelId,
        text: message1.text,
      });
      expect(expected).toEqual(message1);
    });

    test('throws the correct errors if not authorized', async () => {
      dbClient().first.mockReturnValueOnce(false);

      await expect(
        messages.create({ text: message1.text, channelId: message1.channelId })
      ).rejects.toThrow(ForbiddenError);
    });

    test('publishes new messages to subscriptions', async () => {
      dbClient().first.mockReturnValueOnce(true);
      dbClient().returning.mockReturnValueOnce([message1]);

      await messages.create({
        channelId: message1.channelId,
        text: message1.text,
      });

      expect(
        messages.context.pubsub.publish
      ).toHaveBeenCalledWith(MESSAGE_ADDED_EVENT, { messageAdded: message1 });
    });
  });
});
