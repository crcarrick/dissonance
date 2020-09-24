import { client } from '@dissonance/client';
import { useRouter } from '@dissonance/hooks';

import { READ_SERVER } from './ChannelList.gql';

export const useChannelList = () => {
  const { history, match } = useRouter();

  const server = client.readFragment({
    id: `Server:${match.params.serverId}`,
    fragment: READ_SERVER,
  });

  const handleChannelClick = (channelId) => () =>
    history.push(`/channels/${server.id}/${channelId}`);

  return {
    getChannelProps: ({ id }) => ({
      key: id,
      button: true,
      onClick: handleChannelClick(id),
      selected: id === match.params.channelId,
    }),

    server,
  };
};
