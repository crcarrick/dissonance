import { useMutation as useApolloMutation } from '@apollo/client';
import { noop } from 'lodash';

export const useMutation = (mutation, options) => {
  const [apolloMutation, ...rest] = useApolloMutation(mutation, {
    onError: noop,
    ...options,
  });

  const wrappedMutation = (args, mutationOptions) =>
    apolloMutation(args, { onError: noop, ...mutationOptions });

  return [wrappedMutation, ...rest];
};
