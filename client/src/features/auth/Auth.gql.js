import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
    }
  }
`;
