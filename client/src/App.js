import React from 'react';

import { useQuery } from '@apollo/client';
import { Redirect, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Loader, ProtectedRoute } from '@dissonance/components';
import { GET_ME } from '@dissonance/data';

import { Auth } from './features/auth';
import { Home } from './features/home';

export const App = () => {
  const { data, loading } = useQuery(GET_ME);

  const canActivate = () => Boolean(data?.me);

  return (
    <>
      <CssBaseline />
      {loading ? (
        <Loader type="Connecting" />
      ) : (
        <Switch>
          <Route path="/auth/:type(login|signup)">
            <Auth />
          </Route>
          <ProtectedRoute
            canActivate={canActivate}
            path="/"
            redirectPath="/auth/login"
          >
            <Home />
          </ProtectedRoute>
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      )}
    </>
  );
};
