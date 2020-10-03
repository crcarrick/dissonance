import { useCallback } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { find, uniqBy } from 'lodash';

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
        endCursor
      }
    }
  }
  ${MESSAGE_FIELDS}
`;

const wrappedFetchMore = ({ input, fetchMore }) =>
  fetchMore({
    variables: { input },
    updateQuery: ({ messageFeed }, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return messageFeed;
      }

      console.log(messageFeed);

      return {
        messageFeed: {
          ...messageFeed,
          edges: [...fetchMoreResult.messageFeed.edges, ...messageFeed.edges],

          pageInfo: {
            ...messageFeed.pageInfo,
            ...fetchMoreResult.messageFeed.pageInfo,
          },
        },
      };
    },
  });

const wrappedSubscribeToMore = ({ channelId, subscribeToMore }) =>
  subscribeToMore({
    document: MESSAGE_ADDED,
    variables: { input: { channelId } },
    updateQuery: ({ messageFeed }, { subscriptionData }) => {
      if (!subscriptionData.data) {
        return messageFeed;
      }

      const message = subscriptionData.data.messageAdded;

      // Don't add messages twice
      if (find(messageFeed, { id: message.id })) {
        return messageFeed;
      }

      return {
        messageFeed: {
          ...messageFeed,
          edges: [...messageFeed.edges, message],
        },
      };
    },
  });

export const useGetMessageFeed = ({ input }) => {
  const { data, loading, error, fetchMore, subscribeToMore } = useQuery(
    GET_MESSAGE_FEED,
    {
      variables: {
        input: {
          ...input,
          first: 20,
        },
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );

  const endCursor = data?.messageFeed?.pageInfo.endCursor;

  return {
    data,
    loading,
    error,
    fetchMore: useCallback(
      () =>
        wrappedFetchMore({
          input: {
            channelId: input.channelId,
            first: 20,
            before: endCursor,
          },
          fetchMore,
        }),
      [endCursor, input.channelId, fetchMore]
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
