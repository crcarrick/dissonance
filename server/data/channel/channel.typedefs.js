import gql from 'graphql-tag';

export const channelTypeDefs = gql`
  extend type Query {
    channel(id: ID!): Channel
    channels: [Channel]
  }

  extend type Mutation {
    createChannel(name: String!, serverId: ID!): Channel
  }

  type Channel {
    id: ID!
    messages: [Message]
    name: String!
  }
`;
