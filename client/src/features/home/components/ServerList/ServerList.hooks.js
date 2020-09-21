import { client } from '@dissonance/client';
import { useRouter } from '@dissonance/hooks';

import { READ_SERVERS } from './ServerList.gql';

export const useServerList = () => {
  const { history, match } = useRouter();
  const {
    me: { servers },
  } = client.readQuery({
    query: READ_SERVERS,
  });

  const selected = servers.find(
    (server) => server.id === match.params.serverId
  );

  return { history, match, selected, servers };
};
