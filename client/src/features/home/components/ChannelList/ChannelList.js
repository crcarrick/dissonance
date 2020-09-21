import React from 'react';

import { Divider, List, ListItem, ListItemText } from '@material-ui/core';

import {
  ChannelListContainer,
  ChannelListServerName,
  ChannelListChannels,
} from './ChannelList.style';
import { useChannelList } from './ChannelList.hooks';

export const ChannelList = () => {
  const { handleChannelClick, server } = useChannelList();

  return (
    <ChannelListContainer>
      <ChannelListServerName>{server.name}</ChannelListServerName>
      <Divider />
      <ChannelListChannels>
        <List component="nav">
          {server.channels.map((channel) => (
            <React.Fragment key={channel.id}>
              <ListItem button={true} onClick={handleChannelClick(channel.id)}>
                <ListItemText>#{channel.name}</ListItemText>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </ChannelListChannels>
    </ChannelListContainer>
  );
};
