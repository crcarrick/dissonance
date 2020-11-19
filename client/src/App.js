import React, { useCallback } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Loader, ProtectedRoute } from '@dissonance/components';
import { AuthContextProvider } from '@dissonance/contexts';
import { useGetMe } from '@dissonance/data';

import { Auth } from './features/auth';
import { Home } from './features/home';

export const App = () => {
  const { data, loading } = useGetMe();

  const canActivate = useCallback(() => Boolean(data?.me), [data]);

  return (
    <>
      <CssBaseline />
      {loading ? (
        <Loader type="Connecting" />
      ) : (
        <AuthContextProvider value={{ user: data?.me }}>
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
        </AuthContextProvider>
      )}
    </>
  );
};
