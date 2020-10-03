import { gql, useSubscription } from '@apollo/client';

import { MESSAGE_FIELDS } from './MessageFields.gql';

export const MESSAGE_ADDED = gql`
  subscription OnMessageAdded($input: MessageAddedInput!) {
    messageAdded(input: $input) {
      cursor
      node {
        ...MessageFields
      }
    }
  }
  ${MESSAGE_FIELDS}
`;

export const useMessageAdded = ({ input }) => {
  const { data, loading, error } = useSubscription(MESSAGE_ADDED, {
    variables: { input },
  });

  return { data, loading, error };
};
