import { gql, useLazyQuery, useQuery } from '@apollo/client';

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

export const useGetMe = ({ input }) => {
  const { data, loading, error } = useQuery(GET_ME, {
    variables: {
      input,
    },
  });

  return { data, loading, error };
};

export const useLazyGetMe = ({ input }) => {
  const [getMe] = useLazyQuery(GET_ME, {
    variables: {
      input,
    },
  });

  return getMe;
};
