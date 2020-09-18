import styled from '@emotion/styled';
import { Form } from 'formik';
import { Box, Button, Paper } from '@material-ui/core';

const flexCenter = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const AuthContainer = styled(Box)`
  ${flexCenter}
  height: 100%;
  width: 100%;
  background-image: url('/images/auth-background.jpg');
  background-size: cover;
`;

export const AuthBox = styled(Paper)`
  max-width: 500px;
  width: 80%;
  padding: 30px;
`;

export const AuthLogoContainer = styled.div`
  ${flexCenter}
  margin-bottom: 30px;
`;

export const AuthForm = styled(Form)`
  ${flexCenter}
`;

export const AuthLogo = styled.img`
  width: 100px;
`;

export const AuthButton = styled(Button)`
  height: 40px;
  margin-top: 10px;
`;

export const AuthErrors = styled.div`
  ${flexCenter}
  ${({ theme }) => `
    background-color: ${theme.palette.error.main};
    border-radius: ${theme.shape.borderRadius}px;
  `}
  align-items: flex-start;
  margin-top: 20px;
  padding-left: 10px;
  width: 100%;
  height: 30px;
`;
