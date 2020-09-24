import React from 'react';

import { Divider } from '@material-ui/core';

import {
  ChannelListChannel,
  ChannelListChannels,
  ChannelListChannelText,
  ChannelListContainer,
  ChannelListServerName,
} from './ChannelList.style';
import { useChannelList } from './ChannelList.hooks';

export const ChannelList = () => {
  const { getChannelProps, server } = useChannelList();

  return (
    <ChannelListContainer>
      <ChannelListServerName>{server.name}</ChannelListServerName>
      <Divider />
      <ChannelListChannels component="nav">
        {server.channels.map((channel) => (
          <ChannelListChannel {...getChannelProps(channel)}>
            <ChannelListChannelText>#{channel.name}</ChannelListChannelText>
          </ChannelListChannel>
        ))}
      </ChannelListChannels>
    </ChannelListContainer>
  );
};
