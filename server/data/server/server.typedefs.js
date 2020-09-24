import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Server Types
  type Server {
    id: ID!
    name: String!
    owner: AuthUser!
    channels: [Channel]!
    users: [AuthUser]!
  }

  type DeleteServerPayload {
    id: ID!
  }

  # Server Inputs
  input GetServerInput {
    id: ID!
  }

  input CreateServerSignedUrlInput {
    fileName: String!
    serverId: ID!
  }

  input CreateServerInput {
    name: String!
  }

  input DeleteServerInput {
    id: ID!
  }

  # Server Queries
  extend type Query {
    server(input: GetServerInput!): Server!
    servers: [Server]!
  }

  # Server Mutations
  extend type Mutation {
    createServerAvatarSignedUrl(
      input: CreateServerSignedUrlInput!
    ): SignedUrlPayload! @authenticated
    createServer(input: CreateServerInput!): Server! @authenticated
    deleteServer(input: DeleteServerInput!): DeleteServerPayload! @authenticated
  }
`;
