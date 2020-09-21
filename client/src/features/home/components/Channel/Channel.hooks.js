import { client } from '@dissonance/client';
import { useRouter } from '@dissonance/hooks';

import { READ_CHANNEL } from './Channel.gql';

export const useChannel = () => {
  const { match } = useRouter();

  const channel = client.readFragment({
    id: `Channel:${match.params.channelId}`,
    fragment: READ_CHANNEL,
  });

  return { channel };
};
