import { useCallback } from 'react';

import { gql, useApolloClient, useQuery } from '@apollo/client';

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

export const useGetMe = () => {
  const response = useQuery(GET_ME);

  return response;
};

export const useLazyGetMe = () => {
  // FIXME:
  //
  // Need to use this hack so that we can await the result of the query
  // Fix if / when Apollo adds this functionality to useLazyQuery
  const client = useApolloClient();

  return [useCallback(() => client.query({ query: GET_ME }), [client])];
};
