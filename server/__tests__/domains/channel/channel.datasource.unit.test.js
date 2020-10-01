import knex from 'knex';

import { TABLE_NAMES } from '@dissonance/constants';
import { ChannelDataSource } from '@dissonance/domains/channel';
import { channelMock } from '@dissonance/test-utils';

describe('ChannelDataSource', () => {
  const channel1 = channelMock();
  const channel2 = channelMock();
  const channel3 = channelMock();
  const channel4 = channelMock({ serverId: channel3.serverId });

  let dbClient;
  let channels;
  beforeAll(() => {
    dbClient = knex({});

    channels = new ChannelDataSource(dbClient, TABLE_NAMES.CHANNELS);
  });

  describe('Gets', () => {
    test('channels by server using a dataloader', async () => {
      dbClient().select.mockResolvedValueOnce([
        channel4,
        channel3,
        channel2,
        channel1,
      ]);

      const expected = await Promise.all([
        channels.getByServer(channel1.serverId),
        channels.getByServer(channel2.serverId),
        channels.getByServer(channel3.serverId),
      ]);

      expect(dbClient().select).toHaveBeenCalledTimes(1);

      expect(expected).toEqual(
        expect.arrayContaining([
          [channel1],
          [channel2],
          expect.arrayContaining([channel3, channel4]),
        ])
      );
    });
  });
});
