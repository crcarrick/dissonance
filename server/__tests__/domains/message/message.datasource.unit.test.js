import { ForbiddenError } from 'apollo-server';
import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';
import {
  MESSAGE_ADDED_EVENT,
  MessageDataSource,
} from '@dissonance/domains/message';

describe('MessageDataSource', () => {
  const [message1, message2, message3, message4] = new Array(4)
    .fill(null)
    .map((_, i) => ({
      id: `${i + 1}`,
      text: `Message ${i}`,
      authorId: '1',
      // use same channelId for message3 & message4 to test byChannelLoader
      channelId: i === 3 ? `${i}` : `${i + 1}`,
    }));

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

      const [expected1, expected2, expected3] = await Promise.all([
        messages.getByChannel(message1.channelId),
        messages.getByChannel(message2.channelId),
        messages.getByChannel(message3.channelId),
      ]);

      expect(dbClient().select.mock.calls.length).toBe(1);

      expect(expected1).toContain(message1);
      expect(expected2).toContain(message2);
      expect(expected3).toContain(message3);
      expect(expected3).toContain(message4);
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

      expect(dbClient().insert.mock.calls[0][0]).toEqual({
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

      expect(messages.context.pubsub.publish.mock.calls[0][0]).toBe(
        MESSAGE_ADDED_EVENT
      );
      expect(messages.context.pubsub.publish.mock.calls[0][1]).toEqual({
        messageAdded: message1,
      });
    });
  });
});
