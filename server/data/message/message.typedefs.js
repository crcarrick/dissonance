import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    messages(channelId: ID!): [Message] @authenticated
  }

  input CreateMessageInput {
    channelId: ID!
    text: String!
  }

  extend type Mutation {
    createMessage(input: CreateMessageInput!): Message @authenticated
  }

  type Message {
    id: ID!
    author: User!
    channel: Channel!
    text: String!
    createdAt: Timestamp!
    updatedAt: Timestamp!
  }
`;
