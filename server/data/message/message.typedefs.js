import gql from 'graphql-tag';

export const messageTypeDefs = gql`
  extend type Query {
    message(id: ID!): Message
    messages: [Message]
  }

  extend type Mutation {
    createMessage(channelId: ID!, text: String!, userId: ID!): Message
  }

  type Message {
    id: ID!
    author: User
    channel: Channel
    text: String!
  }
`;
