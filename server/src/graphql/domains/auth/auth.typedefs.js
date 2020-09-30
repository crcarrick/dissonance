import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Auth Types
  type AuthUser {
    id: ID!
    email: String!
    username: String!
    avatarUrl: String!
    servers: [Server]!
  }

  type AuthPayload {
    token: String!
    user: AuthUser!
  }

  # Auth Inputs
  input LoginInput {
    email: String!
    password: String!
  }

  input SignupInput {
    email: EmailAddress!
    username: String!
    password: String!
  }

  # Auth Queries
  extend type Query {
    me: AuthUser! @authenticated
  }

  # Auth Mutations
  extend type Mutation {
    login(input: LoginInput!): AuthPayload!
    signup(input: SignupInput!): AuthPayload!
  }
`;
