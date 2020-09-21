import { gql } from '@apollo/client';

export const READ_CHANNEL = gql`
  fragment CurrentChannel on Channel {
    id
    name
  }
`;

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
