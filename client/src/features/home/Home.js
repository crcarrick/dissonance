import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { HomeContainer } from './Home.style';

import { Channel } from './components/Channel';
import { ChannelList } from './components/ChannelList';
import { ServerList } from './components/ServerList';

export const Home = () => {
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
      </Switch>
    </HomeContainer>
  );
};
