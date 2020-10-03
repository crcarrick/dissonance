import { client } from '@dissonance/client';
import { useLazyGetMessages } from '@dissonance/data';
import { useRouter } from '@dissonance/hooks';

import { READ_SERVER } from './ChannelList.gql';

export const useChannelList = () => {
  const { history, match } = useRouter();

  // const getMessages = useLazyGetMessages();

  const server = client.readFragment({
    id: `Server:${match.params.serverId}`,
    fragment: READ_SERVER,
  });

  const handleChannelClick = (channelId) => () =>
    history.push(`/channels/${server.id}/${channelId}`);

  // Try to preload messages for channels
  // const handleMouseEnter = (channelId) => () => {
  //   getMessages({ input: { channelId } });
  // };

  return {
    getChannelProps: ({ id }) => ({
      key: id,
      button: true,
      onClick: handleChannelClick(id),
      // onMouseEnter: handleMouseEnter(id),
      selected: id === match.params.channelId,
    }),

    server,
  };
};
