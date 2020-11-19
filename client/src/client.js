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
  if (operationName === 'Login' || operationName === 'Signup') {
    return { headers };
  }

  const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN);

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
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

const defaultFeed = {
  edges: [],
  pageInfo: {},
  totalCount: 0,
};

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          messageFeed: {
            read: (feed = defaultFeed, { canRead }) => {
              return {
                ...feed,
                edges: feed.edges.filter((edge) => canRead(edge)),
              };
            },
            merge: (
              existing = defaultFeed,
              incoming,
              {
                args: {
                  input: { after, before },
                },
              }
            ) => {
              let next = incoming;

              if (after) {
                next = {
                  ...existing,
                  ...incoming,
                  edges: uniqBy(
                    [...existing.edges, ...incoming.edges],
                    (edge) => edge.node.__ref
                  ),
                };
              } else if (before) {
                next = {
                  ...existing,
                  ...incoming,
                  edges: uniqBy(
                    [...incoming.edges, ...existing.edges],
                    (edge) => edge.node.__ref
                  ),
                };
              }

              return next;
            },
          },
        },
      },
    },
  }),
});
