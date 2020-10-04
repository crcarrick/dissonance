import {
  ApolloClient,
  createHttpLink,
  ApolloLink,
  InMemoryCache,
  Observable,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';

import { uniqBy } from 'lodash';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_API,
  fetchOptions: {},
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      authorization: `Bearer ${localStorage.getItem(
        process.env.REACT_APP_AUTH_TOKEN
      )}`,
    },
  },
});

const authLink = setContext(({ operationName }, { headers }) => {
  if (operationName === 'LoginUser' || operationName === 'SignupUser') {
    return { headers };
  }

  const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN);

  return {
    headers: {
      ...headers,
      Authorization: token
        ? `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN)}`
        : '',
    },
  };
});

const artificialLatencyLink = new ApolloLink((operation, forward) => {
  if (process.env.NODE_ENV === 'production') {
    console.error('*** USING ARTIFICIAL LATENCY IN PRODUCTION ***');
  }

  return new Observable(async (observer) => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500));

    const handle = forward(operation).subscribe({
      next: observer.next.bind(observer),
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    });

    return () => handle.unsubscribe();
  });
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(artificialLatencyLink).concat(httpLink)
);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          messages: {
            read: (messages, cache) => {
              if (!messages) {
                return;
              }

              return messages.filter((msg) => cache.canRead(msg));
            },
            merge: (
              existing = [],
              incoming,
              {
                args: {
                  input: { after, before },
                },
              }
            ) => {
              let next;

              if (before) {
                next = uniqBy([...existing, ...incoming], '__ref').slice();

                if (next.length > 200) {
                  next = next.slice(next.length - 200);
                }
              } else if (after) {
                next = uniqBy(
                  [...incoming.reverse(), ...existing],
                  '__ref'
                ).slice();

                console.log(next);

                if (next.length > 200) {
                  next = next.slice(0, 200);
                }
              } else {
                next = incoming;
              }

              return next;
            },
          },
        },
      },
    },
  }),
});
