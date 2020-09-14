import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    channel(id: ID!): Channel
    channels: [Channel]
  }

  input CreateChannelInput {
    name: String!
    serverId: ID!
  }

  extend type Mutation {
    createChannel(input: CreateChannelInput!): Channel
  }

  type Channel {
    id: ID!
    messages: [Message]
    name: String!
  }
`;
