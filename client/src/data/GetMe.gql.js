import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      username
      avatarUrl
      servers {
        id
        name
        avatarUrl
        channels {
          id
          name
        }
      }
    }
  }
`;
