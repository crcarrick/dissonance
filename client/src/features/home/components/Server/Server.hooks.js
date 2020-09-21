import { client } from '@dissonance/client';

import { READ_SERVER } from './Server.gql';

export const useServer = ({ serverId }) => {
  const server = client.readFragment({
    id: `Server:${serverId}`,
    fragment: READ_SERVER,
  });

  return { server };
};
