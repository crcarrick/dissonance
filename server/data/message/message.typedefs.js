import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Message Types
  type Message {
    id: ID!
    text: String!
    author: User!
    channel: Channel!
    createdAt: Timestamp!
    updatedAt: Timestamp!
  }

  type NewMessage {
    id: ID!
    text: String!
    author: User!
    channelId: String!
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

  # Message Mutations
  extend type Mutation {
    createMessage(input: CreateMessageInput!): Message @authenticated
  }

  # Message Subscriptions
  extend type Subscription {
    messageAdded(input: MessageAddedInput!): NewMessage
  }
`;
