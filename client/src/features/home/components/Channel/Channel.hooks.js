import { useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';

import { client } from '@dissonance/client';
import { useRouter } from '@dissonance/hooks';

import { CREATE_MESSAGE, GET_CHANNEL } from './Channel.gql';

export const useChannel = () => {
  const [message, setMessage] = useState('');

  const { match } = useRouter();

  const { data, loading } = useQuery(GET_CHANNEL, {
    variables: { input: { id: match.params.channelId } },
  });

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    refetchQueries: [
      {
        query: GET_CHANNEL,
        variables: { input: { id: match.params.channelId } },
      },
    ],
  });

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
