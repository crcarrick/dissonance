import { gql } from '@apollo/client';

export const CREATE_USER_AVATAR_SIGNED_URL = gql`
  mutation CreateUserAvatarSignedUrl($input: CreateUserSignedUrlInput!) {
    createUserAvatarSignedUrl(input: $input) {
      signedUrl
      url
    }
  }
`;

export const CREATE_SERVER_AVATAR_SIGNED_URL = gql`
  mutation CreateServerAvatarSignedUrl($input: CreateServerSignedUrlInput!) {
    createServerAvatarSignedUrl(input: $input) {
      signedUrl
      url
    }
  }
`;
