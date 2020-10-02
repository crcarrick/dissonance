import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Message Types
  type Message {
    id: ID!
    text: String!
    author: AuthUser!
    channel: Channel!
    createdAt: Timestamp!
    updatedAt: Timestamp!
  }

  # Message Inputs
  input GetMessagesInput {
    channelId: ID!
  }

  input CreateMessageInput {
    channelId: ID!
    text: String!
  }

  input MessageAddedInput {
    channelId: ID!
  }

  # Message Queries
  extend type Query {
    messages(input: GetMessagesInput!): [Message]! @authenticated
  }

  # Message Mutations
  extend type Mutation {
    createMessage(input: CreateMessageInput!): Message! @authenticated
  }

  # Message Subscriptions
  extend type Subscription {
    messageAdded(input: MessageAddedInput!): Message!
  }
`;
