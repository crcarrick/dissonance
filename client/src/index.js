import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'emotion-theming';

import { App } from './App';

import { client } from './client';
import { theme } from './theme';

import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </MuiThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
