import React from 'react';

import { useQuery } from '@apollo/client';
import { Redirect, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Loader, ProtectedRoute } from '@dissonance/components';

import { Auth } from './features/auth';
import { Servers } from './features/servers';

import { GET_ME } from './data';

export const App = () => {
  const { data: { me: user } = {}, loading } = useQuery(GET_ME);

  const canActivate = () => !!user;

  return (
    <>
      <CssBaseline />
      {loading ? (
        <Loader />
      ) : (
        <Switch>
          <Route path="/auth/:type(login|signup)">
            <Auth />
          </Route>
          <ProtectedRoute
            canActivate={canActivate}
            path="/servers"
            redirectPath="/auth/login"
          >
            <Servers />
          </ProtectedRoute>
          <Route path="*" render={() => <Redirect to="/auth/login" />} />
        </Switch>
      )}
    </>
  );
};
