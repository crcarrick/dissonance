import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Message Types
  type Message {
    id: ID!
    cursor: ID!
    text: String!
    author: AuthUser!
    channel: Channel!
    createdAt: Timestamp!
    updatedAt: Timestamp!
  }

  type MessageFeedEdge {
    cursor: ID!
    node: Message!
  }

  type MessageFeedPageInfo {
    startCursor: ID!
    endCursor: ID!
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  type MessageFeedResponse {
    edges: [MessageFeedEdge]!
    pageInfo: MessageFeedPageInfo!
    totalCount: Int!
  }

  # Message Inputs
  input CreateMessageInput {
    channelId: ID!
    text: String!
  }

  input MessageAddedInput {
    channelId: ID!
  }

  input MessageFeedInput {
    after: ID
    before: ID
    first: Int
    last: Int
    channelId: ID!
  }

  # Message Queries
  extend type Query {
    messageFeed(input: MessageFeedInput!): MessageFeedResponse! @authenticated
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
