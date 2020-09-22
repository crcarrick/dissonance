import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Server Types
  type Server {
    id: ID!
    name: String!
    owner: User!
    channels: [Channel]!
    users: [User]!
  }

  type DeleteServerPayload {
    id: ID!
  }

  # Server Inputs
  input GetServerInput {
    id: ID!
  }

  input CreateServerInput {
    name: String!
  }

  input DeleteServerInput {
    id: ID!
  }

  # Server Queries
  extend type Query {
    server(input: GetServerInput!): Server
    servers: [Server]
  }

  # Server Mutations
  extend type Mutation {
    createServer(input: CreateServerInput!): Server @authenticated
    deleteServer(input: DeleteServerInput!): DeleteServerPayload @authenticated
  }
`;
