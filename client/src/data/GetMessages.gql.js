import { useCallback } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { find } from 'lodash';

import { MESSAGE_ADDED } from './MessageAdded.gql';
import { MESSAGE_FIELDS } from './MessageFields.gql';

export const GET_MESSAGES = gql`
  query GetMessages($input: GetMessagesInput!) {
    messages(input: $input) {
      ...MessageFields
    }
  }
  ${MESSAGE_FIELDS}
`;

const wrappedSubscribeToMore = ({ channelId, subscribeToMore }) =>
  subscribeToMore({
    document: MESSAGE_ADDED,
    variables: { input: { channelId } },
    updateQuery({ messages }, { subscriptionData }) {
      if (!subscriptionData.data) {
        return messages;
      }

      const message = subscriptionData.data.messageAdded;

      // Don't add messages twice
      if (find(messages, { id: message.id })) {
        return messages;
      }

      return {
        messages: [...messages, message],
      };
    },
  });

export const useGetMessages = ({ input }) => {
  const { data, loading, error, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: {
      input,
    },
    fetchPolicy: 'cache-and-network',
  });

  return {
    data,
    loading,
    error,
    subscribeToMore: useCallback(
      () =>
        wrappedSubscribeToMore({
          channelId: input.channelId,
          subscribeToMore,
        }),
      [input.channelId, subscribeToMore]
    ),
  };
};

export const useLazyGetMessages = () => {
  const [getMessages] = useLazyQuery(GET_MESSAGES);

  return ({ input }) => getMessages({ variables: { input } });
};
