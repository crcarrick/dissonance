import { useEffect, useState } from 'react';

import { gql } from '@apollo/client';

import { client } from '@dissonance/client';
import { useCreateMessage, useGetMessageFeed } from '@dissonance/data';
import { useRouter } from '@dissonance/hooks';

export const useChannel = (scrollbarRef) => {
  const { match } = useRouter();
  const [message, setMessage] = useState('');

  const channel = client.readFragment({
    fragment: gql`
      fragment CurrentChannel2 on Channel {
        name
      }
    `,
    id: `Channel:${match.params.channelId}`,
  });

  const { data, loading, fetchMore, subscribeToMore } = useGetMessageFeed({
    input: { channelId: match.params.channelId },
  });
  const createMessage = useCreateMessage();

  const messages = data?.messageFeed?.edges.length;

  useEffect(() => {
    const unsubscribe = subscribeToMore();

    return () => unsubscribe();
  }, [match.params.channelId, subscribeToMore]);

  useEffect(() => {
    scrollbarRef.current.scrollToBottom();
  }, [messages, scrollbarRef]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message.length) {
      setMessage('');

      createMessage({
        input: { channelId: match.params.channelId, text: message },
      });
    }
  };

  const handleChange = ({ target: { value } }) => setMessage(value);

  return {
    channel,
    messages: data?.messageFeed?.edges.map((edge) => edge.node).reverse(),
    fetchMore,
    handleChange,
    handleSubmit,
    loading,
    message,
  };
};
