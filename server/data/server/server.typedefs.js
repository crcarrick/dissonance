import gql from 'graphql-tag';

export const serverTypeDefs = gql`
  extend type Query {
    server(id: ID!): Server
    servers: [Server]
  }

  extend type Mutation {
    createServer(name: String!): Server
  }

  type Server {
    id: ID!
    name: String!
    channels: [Channel]
  }
`;
