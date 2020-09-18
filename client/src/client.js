import {
  ApolloClient,
  createHttpLink,
  ApolloLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_API,
  fetchOptions: {},
});

const authLink = setContext(({ operationName }, { headers }) => {
  if (operationName === 'LoginUser' || operationName === 'SignupUser') {
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

export const client = new ApolloClient({
  link: authLink.concat(artificialLatencyLink).concat(httpLink),
  cache: new InMemoryCache(),
});
