import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Channel Types
  type Channel {
    id: ID!
    messages: [Message]
    name: String!
  }

  # Channel Inputs
  input FindChannelInput {
    id: ID!
  }

  input CreateChannelInput {
    name: String!
    serverId: ID!
  }

  # Channel Queries
  extend type Query {
    channel(input: FindChannelInput!): Channel
    channels: [Channel]
  }

  # Channel Mutations
  extend type Mutation {
    createChannel(input: CreateChannelInput!): Channel
  }
`;
