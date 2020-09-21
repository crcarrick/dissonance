import { gql } from '@apollo/client';

export const READ_SERVER = gql`
  fragment CurrentServer on Server {
    id
    name
    channels {
      id
      name
    }
  }
`;
