import { gql } from '@apollo/client';

export const READ_CHANNEL = gql`
  fragment CurrentChannel on Channel {
    id
    name
  }
`;
