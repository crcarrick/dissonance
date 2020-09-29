import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';

import { ChannelDataSource } from './channel.datasource';

describe('ChannelDataSource', () => {
  const [channel1, channel2, channel3, channel4] = new Array(4)
    .fill(null)
    .map((_, i) => ({
      // use same serverId for channel3 & channel4 to test byServerLoader
      serverId: i === 3 ? `${i}` : `${i + 1}`,
    }));

  let dbClient;
  let channels;
  beforeAll(() => {
    dbClient = knex({});

    channels = new ChannelDataSource(dbClient, TABLE_NAMES.CHANNELS);
  });

  describe('gets', () => {
    test('channels by server using a dataloader', async () => {
      dbClient().select.mockReturnValueOnce(
        Promise.resolve([channel4, channel3, channel2, channel1])
      );

      const [expected1, expected2, expected3] = await Promise.all([
        channels.getByServer(channel1.serverId),
        channels.getByServer(channel2.serverId),
        channels.getByServer(channel3.serverId),
      ]);

      expect(dbClient().select.mock.calls.length).toBe(1);

      expect(expected1).toContain(channel1);
      expect(expected2).toContain(channel2);
      expect(expected3).toContain(channel3);
      expect(expected3).toContain(channel4);
    });
  });
});
