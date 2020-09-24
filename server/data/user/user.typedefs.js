import { gql } from 'apollo-server';

export const typeDefs = gql`
  # User Types
  type User {
    id: ID!
    email: String!
    username: String!
    password: String!
    avatarUrl: String!
    servers: [Server]!
  }

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

  # User Inputs
  input CreateUserSignedUrlInput {
    fileName: String!
  }

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
    me: AuthUser! @authenticated
  }

  # User Mutations
  extend type Mutation {
    loginUser(input: LoginUserInput!): AuthPayload!
    signupUser(input: SignupUserInput!): AuthPayload!
    joinServer(input: JoinServerInput!): AuthUser! @authenticated
    createUserAvatarSignedUrl(
      input: CreateUserSignedUrlInput!
    ): SignedUrlPayload! @authenticated
  }
`;
