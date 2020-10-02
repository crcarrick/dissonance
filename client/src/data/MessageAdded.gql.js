import { gql, useSubscription } from '@apollo/client';

export const MESSAGE_ADDED = gql`
  subscription OnMessageAdded($input: MessageAddedInput!) {
    messageAdded(input: $input) {
      id
      text
      createdAt
      updatedAt
      author {
        id
        username
        avatarUrl
      }
    }
  }
`;

export const useMessageAdded = ({ input }) => {
  const { data, loading, error } = useSubscription(MESSAGE_ADDED, {
    variables: { input },
  });

  return { data, loading, error };
};
