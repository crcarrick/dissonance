import { gql } from 'apollo-server';

export const typeDefs = gql`
  input LoginUserInput {
    email: String!
    password: String!
  }

  input SignupUserInput {
    email: EmailAddress!
    username: String!
    password: String!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    password: String!
  }

  type AuthUser {
    id: ID!
    email: String!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: AuthUser!
  }

  extend type Query {
    me: AuthUser @authenticated
  }

  extend type Mutation {
    loginUser(input: LoginUserInput!): AuthPayload!
    signupUser(input: SignupUserInput!): AuthPayload!
  }
`;
