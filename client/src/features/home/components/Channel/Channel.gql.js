import { gql } from '@apollo/client';

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      __typename
      id
      text
      createdAt
      updatedAt
      author {
        id
        username
      }
    }
  }
`;

export const GET_CHANNEL = gql`
  query GetChannel($input: GetChannelInput!) {
    channel(input: $input) {
      id
      name
      messages {
        id
        text
        createdAt
        updatedAt
        author {
          id
          username
        }
      }
    }
  }
`;

export const MESSAGE_ADDED = gql`
  subscription MessageAdded($input: MessageAddedInput!) {
    messageAdded(input: $input) {
      id
      text
      createdAt
      updatedAt
      author {
        id
        username
      }
    }
  }
`;
