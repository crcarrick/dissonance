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

  # User Inputs
  input CreateUserSignedUrlInput {
    fileName: String!
  }

  # User Mutations
  extend type Mutation {
    createUserAvatarSignedUrl(
      input: CreateUserSignedUrlInput!
    ): SignedUrlPayload! @authenticated
  }
`;
