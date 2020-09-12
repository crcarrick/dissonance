import gql from 'graphql-tag';

export const userTypeDefs = gql`
  extend type Query {
    user(id: ID!): User
    users: [User]
  }

  extend type Mutation {
    createUser(username: String!): User
  }

  type User {
    id: ID!
    username: String!
  }
`;
