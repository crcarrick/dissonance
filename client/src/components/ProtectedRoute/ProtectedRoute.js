import React from 'react';

import { Redirect, Route } from 'react-router-dom';

export const ProtectedRoute = ({
  children,
  canActivate,
  redirectPath,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        canActivate() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirectPath,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
