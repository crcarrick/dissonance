import React, { useContext } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import { AuthContext } from '@dissonance/contexts';

import { HomeContainer } from './Home.style';

import { Channel } from './components/Channel';
import { ChannelList } from './components/ChannelList';
import { ServerList } from './components/ServerList';

export const Home = () => {
  const { user } = useContext(AuthContext);
  const [server] = user.servers;
  const [channel] = server.channels;

  return (
    <HomeContainer>
      <Switch>
        <Route exact path="/channels/:serverId">
          <ServerList />
          <ChannelList />
        </Route>
        <Route exact path="/channels/:serverId/:channelId">
          <ServerList />
          <ChannelList />
          <Channel />
        </Route>
        <Route
          path="*"
          render={() => (
            <Redirect to={`/channels/${server.id}/${channel.id}`} />
          )}
        />
      </Switch>
    </HomeContainer>
  );
};
