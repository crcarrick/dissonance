import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import { ReactComponent as DiscordIcon } from '@dissonance/assets/images/discord-icon.svg';

import {
  ServerListContainer,
  ServerListIconWrapper,
  ServerListInnerContainer,
} from './ServerList.style';
import { useServerList } from './ServerList.hooks';

export const ServerList = () => {
  const { history, selected, servers } = useServerList();

  const handleClick = ({ id, channels }) => () => {
    history.push(`/channels/${id}/${channels[0].id}`);
  };

  return (
    <ServerListContainer>
      <Scrollbars
        autoHeight={true}
        autoHeightMax={'100vh'}
        autoHide={true}
        autoHideTimeout={500}
      >
        <ServerListInnerContainer>
          {servers.map(({ id, channels }) => (
            <ServerListIconWrapper
              key={id}
              selected={id === selected.id}
              onClick={handleClick({ id, channels })}
            >
              <DiscordIcon style={{ fill: 'white' }} />
            </ServerListIconWrapper>
          ))}
        </ServerListInnerContainer>
      </Scrollbars>
    </ServerListContainer>
  );
};
