import { useCallback } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';

import { MESSAGE_ADDED } from './MessageAdded.gql';
import { MESSAGE_FIELDS } from './MessageFields.gql';

export const GET_MESSAGE_FEED = gql`
  query GetMessageFeed($input: MessageFeedInput!) {
    messageFeed(input: $input) {
      edges {
        node {
          ...MessageFields
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${MESSAGE_FIELDS}
`;

const wrappedFetchMore = ({
  startCursor,
  endCursor,
  direction,
  input,
  fetchMore,
}) => {
  let inpt = { ...input };

  if (direction === 'up') {
    inpt.before = startCursor;
    inpt.last = 20;
  } else if (direction === 'down') {
    inpt.after = endCursor;
    inpt.first = 20;
  }

  return fetchMore({
    variables: { input: inpt },
  });
};

const wrappedSubscribeToMore = ({ channelId, subscribeToMore }) =>
  subscribeToMore({
    document: MESSAGE_ADDED,
    variables: { input: { channelId } },
    updateQuery: ({ messageFeed }, { subscriptionData }) => {
      if (!subscriptionData.data) {
        return messageFeed;
      }

      const message = subscriptionData.data.messageAdded;

      return {
        messageFeed: {
          ...messageFeed,
          edges: [message, ...messageFeed.edges],
        },
      };
    },
  });

export const useGetMessageFeed = ({ input }) => {
  const {
    data = { messageFeed: { edges: [], pageInfo: {}, totalCount: 0 } },
    loading,
    error,
    fetchMore,
    subscribeToMore,
  } = useQuery(GET_MESSAGE_FEED, {
    variables: {
      input: {
        ...input,
        last: 50,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const { startCursor, endCursor } = data.messageFeed.pageInfo;

  return {
    data,
    loading,
    error,
    fetchMore: useCallback(
      ({ direction }) =>
        wrappedFetchMore({
          input: {
            channelId: input.channelId,
          },
          startCursor,
          endCursor,
          direction,
          fetchMore,
        }),
      [startCursor, endCursor, input.channelId, fetchMore]
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

export const useLazyGetMessageFeed = () => {
  const [getMessageFeed] = useLazyQuery(GET_MESSAGE_FEED);

  return ({ input }) => getMessageFeed({ variables: { input } });
};
