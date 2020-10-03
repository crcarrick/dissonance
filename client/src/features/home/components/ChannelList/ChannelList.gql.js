import { gql } from '@apollo/client';

export const READ_CHANNEL = gql`
  fragment CurrentChannelListChannel on Channel {
    id
    name
  }
`;

export const READ_SERVER = gql`
  fragment CurrentChannelListServer on Server {
    id
    name
    channels {
      id
      name
    }
  }
`;
