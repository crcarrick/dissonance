import React from 'react';

import {
  ChannelListChannel,
  ChannelListChannels,
  ChannelListChannelName,
  ChannelListChannelPoundSign,
  ChannelListChannelText,
  ChannelListContainer,
  ChannelListTopBar,
} from './ChannelList.style';
import { useChannelList } from './ChannelList.hooks';

export const ChannelList = () => {
  const { getChannelProps, server } = useChannelList();

  return (
    <ChannelListContainer>
      <ChannelListTopBar>{server.name}</ChannelListTopBar>
      <ChannelListChannels component="nav">
        {server.channels.map((channel) => (
          <ChannelListChannel {...getChannelProps(channel)}>
            <ChannelListChannelText>
              <ChannelListChannelPoundSign />
              <ChannelListChannelName>{channel.name}</ChannelListChannelName>
            </ChannelListChannelText>
          </ChannelListChannel>
        ))}
      </ChannelListChannels>
    </ChannelListContainer>
  );
};
