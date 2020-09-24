import { gql } from 'apollo-server';

export const typeDefs = gql`
  # UserServer Types
  type UserServer {
    userId: ID!
    serverId: ID!
  }

  # UserServer Inputs
  input JoinServerInput {
    serverId: ID!
  }

  # UserServer Mutations
  extend type Mutation {
    joinServer(input: JoinServerInput!): UserServer! @authenticated
  }
`;
