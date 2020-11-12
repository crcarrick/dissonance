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

const wrappedFetchMore = ({ after, before, direction, input, fetchMore }) => {
  let inpt = { ...input };

  if (direction === 'up') {
    inpt.before = before;
  } else if (direction === 'down') {
    inpt.after = after;
  }

  return fetchMore({
    variables: { input: inpt },
  });
};

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
  const { data, loading, error, fetchMore, subscribeToMore } = useQuery(
    GET_MESSAGES,
    {
      variables: {
        input: {
          ...input,
          first: 50,
        },
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  // This is a little counterintuitive because we're reversing the list later
  const after = data?.messages[0].cursor;
  const before = data?.messages[data.messages.length - 1].cursor;

  return {
    data,
    loading,
    error,
    fetchMore: useCallback(
      ({ direction }) =>
        wrappedFetchMore({
          input: {
            channelId: input.channelId,
            first: 50,
          },
          after,
          before,
          direction,
          fetchMore,
        }),
      [after, before, input.channelId, fetchMore]
    ),
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
