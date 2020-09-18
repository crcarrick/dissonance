import { useLazyQuery as useApolloLazyQuery } from '@apollo/client';
import { noop } from 'lodash';

export const useLazyQuery = (query, options) => {
  const [apolloLazyQuery, ...rest] = useApolloLazyQuery(query, {
    onError: noop,
    ...options,
  });

  const wrappedLazyQuery = (args, _options) =>
    apolloLazyQuery(args, { onError: noop, ..._options });

  return [wrappedLazyQuery, ...rest];
};
