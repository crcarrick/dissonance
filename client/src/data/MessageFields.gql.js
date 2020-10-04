import { gql } from '@apollo/client';

export const MESSAGE_FIELDS = gql`
  fragment MessageFields on Message {
    id
    cursor
    text
    createdAt
    updatedAt
    author {
      id
      username
      avatarUrl
    }
  }
`;
