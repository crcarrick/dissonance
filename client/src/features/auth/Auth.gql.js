import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation SignupUser($input: SignupUserInput!) {
    signupUser(input: $input) {
      token
    }
  }
`;
