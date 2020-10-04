import { useContext } from 'react';

import { gql, useMutation } from '@apollo/client';
import { find } from 'lodash';

import { useRouter } from '@dissonance/hooks';

import { GET_MESSAGES } from './GetMessages.gql';
import { MESSAGE_FIELDS } from './MessageFields.gql';

import { AuthContext } from '../auth.context';

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      ...MessageFields
    }
  }
  ${MESSAGE_FIELDS}
`;

export const useCreateMessage = () => {
  const { user } = useContext(AuthContext);
  const { match } = useRouter();

  const [createMessage] = useMutation(CREATE_MESSAGE);

  return ({ input }) => {
    createMessage({
      variables: { input },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message',
          id: '',
          cursor: '',
          text: input.text,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          author: {
            __typename: 'AuthUser',
            id: user.id,
            username: user.username,
            avatarUrl: user.avatarUrl,
          },
        },
      },
      update(cache, { data: { createMessage } }) {
        const data = cache.readQuery({
          query: GET_MESSAGES,
          variables: {
            input: {
              channelId: match.params.channelId,
              first: 20,
            },
          },
        });

        // Don't add messages twice
        if (find(data.messages, { id: createMessage.id })) {
          return;
        }

        cache.writeQuery({
          query: GET_MESSAGES,
          variables: {
            input: {
              channelId: match.params.channelId,
              first: 20,
            },
          },
          data: {
            messages: [createMessage, ...data.messages],
          },
        });
      },
    });
  };
};
