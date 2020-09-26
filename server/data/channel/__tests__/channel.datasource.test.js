import knex from 'knex';
import mockKnex from 'mock-knex';

import { TABLE_NAMES } from './../../constants';
import { ChannelDataSource } from './../channel.datasource';

describe('ChannelDataSource', () => {
  const tracker = mockKnex.getTracker();

  let channels;
  beforeAll(() => {
    const dbClient = knex({
      client: 'postgres',
      connection: '',
      useNullAsDefault: false,
    });

    mockKnex.mock(dbClient);

    channels = new ChannelDataSource(dbClient, TABLE_NAMES.CHANNELS);
  });

  describe('gets', () => {
    beforeEach(() => {
      tracker.install();
    });

    afterEach(() => {
      tracker.uninstall();
    });

    test('channels by server', async () => {
      const channel1 = { serverId: '1' };
      const channel2 = { serverId: '2' };
      const channel3 = { serverId: '3' };

      tracker.on('query', (query) => {
        query.response([channel3, channel2, channel1]);
      });

      const [expected1] = await channels.getByServer(channel1.serverId);
      const [expected2] = await channels.getByServer(channel2.serverId);
      const [expected3] = await channels.getByServer(channel3.serverId);

      expect(expected1).toEqual(channel1);
      expect(expected2).toEqual(channel2);
      expect(expected3).toEqual(channel3);
    });
  });
});
