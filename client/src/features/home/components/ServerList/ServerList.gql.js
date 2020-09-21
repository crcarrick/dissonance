import { gql } from '@apollo/client';

export const READ_SERVERS = gql`
  query ReadServers {
    me {
      servers {
        id
        name
        channels {
          id
        }
      }
    }
  }
`;
