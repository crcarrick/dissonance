import { gql, useLazyQuery, useQuery } from '@apollo/client';

export const GET_CHANNEL = gql`
  query GetChannel($input: GetChannelInput!) {
    channel(input: $input) {
      id
      name
    }
  }
`;

export const useGetChannel = ({ input }) => {
  const { data, loading, error } = useQuery(GET_CHANNEL, {
    variables: {
      input,
    },
  });

  return { data, loading, error };
};

export const useLazyGetChannel = ({ input }) => {
  const [getChannel] = useLazyQuery(GET_CHANNEL, {
    variables: {
      input,
    },
  });

  return getChannel;
};
