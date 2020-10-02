import { useEffect, useState } from 'react';

import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { useRouter } from '@dissonance/hooks';

import { CREATE_MESSAGE, GET_CHANNEL, MESSAGE_ADDED } from './Channel.gql';

export const useChannel = (scrollbarRef) => {
  const [message, setMessage] = useState('');

  const { match } = useRouter();

  const { data, loading } = useQuery(GET_CHANNEL, {
    variables: { input: { id: match.params.channelId } },
  });

  const { data: subData } = useSubscription(MESSAGE_ADDED, {
    variables: { input: { channelId: match.params.channelId } },
  });

  console.log(subData?.messageAdded);

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    refetchQueries: [
      {
        query: GET_CHANNEL,
        variables: { input: { id: match.params.channelId } },
      },
    ],
  });

  const messages = data?.channel?.messages?.length;

  useEffect(() => {
    scrollbarRef.current.scrollToBottom();
  }, [messages, scrollbarRef]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message.length) {
      setMessage('');

      createMessage({
        optimisticResponse: {
          __typename: 'Mutation',
          createMessage: {
            __typename: 'Message',
            id: '',
            text: message,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            author: {
              __typename: 'AuthUser',
              id: '',
              username: '',
            },
          },
        },
        update: (proxy, { data: { createMessage } }) => {
          const data = proxy.readQuery({
            query: GET_CHANNEL,
            variables: { input: { id: match.params.channelId } },
          });

          proxy.writeQuery({
            query: GET_CHANNEL,
            variables: { input: { id: match.params.channelId } },
            data: {
              channel: {
                ...data.channel,
                messages: [...data.channel.messages, createMessage],
              },
            },
          });
        },
        variables: {
          input: { channelId: match.params.channelId, text: message },
        },
      });
    }
  };

  const handleChange = ({ target: { value } }) => setMessage(value);

  return {
    channel: data?.channel,
    handleChange,
    handleSubmit,
    loading,
    message,
  };
};
