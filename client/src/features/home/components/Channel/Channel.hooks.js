import { useEffect, useState } from 'react';

import { gql } from '@apollo/client';

import { client } from '@dissonance/client';
import { useCreateMessage, useGetMessages } from '@dissonance/data';
import { useRouter } from '@dissonance/hooks';

export const useChannel = () => {
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

  const {
    data = { messages: [] },
    loading,
    fetchMore,
    subscribeToMore,
  } = useGetMessages({
    input: { channelId: match.params.channelId },
  });
  const createMessage = useCreateMessage();

  useEffect(() => {
    const unsubscribe = subscribeToMore();

    return () => unsubscribe();
  }, [match.params.channelId, subscribeToMore]);

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
    messages: data.messages.slice().reverse(),
    fetchMore,
    handleChange,
    handleSubmit,
    loading,
    message,
  };
};
