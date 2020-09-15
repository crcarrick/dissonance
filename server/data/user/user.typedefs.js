import { gql } from 'apollo-server';

export const typeDefs = gql`
  # User Types
  type User {
    id: ID!
    email: String!
    username: String!
    password: String!
    servers: [Server]
  }

  type AuthUser {
    id: ID!
    email: String!
    username: String!
    servers: [Server]
  }

  type AuthPayload {
    token: String!
    user: AuthUser!
  }

  # User Inputs
  input LoginUserInput {
    email: String!
    password: String!
  }

  input SignupUserInput {
    email: EmailAddress!
    username: String!
    password: String!
  }

  input JoinServerInput {
    serverId: ID!
  }

  # User Queries
  extend type Query {
    me: AuthUser @authenticated
  }

  # User Mutations
  extend type Mutation {
    loginUser(input: LoginUserInput!): AuthPayload!
    signupUser(input: SignupUserInput!): AuthPayload!
    joinServer(input: JoinServerInput!): AuthUser! @authenticated
  }
`;
