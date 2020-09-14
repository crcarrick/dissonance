import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    server(id: ID!): Server
    servers: [Server]
  }

  input CreateServerInput {
    name: String!
  }

  extend type Mutation {
    createServer(input: CreateServerInput!): Server @authenticated
  }

  type Server {
    id: ID!
    name: String!
    channels: [Channel]!
    owner: User!
  }
`;
