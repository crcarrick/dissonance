import React from 'react';

import { FormikProvider } from 'formik';
import { Collapse } from '@material-ui/core';

import { Loader } from '@dissonance/components';
import { useRouter } from '@dissonance/hooks';

import {
  AuthContainer,
  AuthBox,
  AuthLogoContainer,
  AuthForm,
  AuthLogo,
  AuthButton,
  AuthErrors,
} from './Auth.style';
import { LOGIN_USER, SIGNUP_USER } from './Auth.gql';
import { useAuth } from './Auth.hooks';

import { AuthField } from './components/AuthField';

export const Auth = () => {
  const { match } = useRouter();

  const initialValues =
    match.params.type === 'login'
      ? { email: '', password: '' }
      : { email: '', username: '', password: '' };
  const mutation = match.params.type === 'login' ? LOGIN_USER : SIGNUP_USER;

  const { form, gqlErrors, loading } = useAuth({
    initialValues,
    mutation,
  });

  return (
    <AuthContainer>
      <AuthBox>
        <AuthLogoContainer>
          <AuthLogo
            alt="Dissonance Icon"
            src={`${process.env.PUBLIC_URL}/images/cartoon-icon.png`}
          />
        </AuthLogoContainer>
        <FormikProvider value={form}>
          <AuthForm>
            <AuthField id="email" name="email" type="email" />

            {match.params.type === 'signup' && (
              <AuthField id="username" name="username" type="text" />
            )}

            <AuthField id="password" name="password" type="password" />

            <AuthButton
              type="submit"
              color="primary"
              variant="contained"
              disableElevation={true}
              fullWidth={true}
            >
              {loading ? (
                <Loader message={false} width={20} />
              ) : (
                match.params.type
              )}
            </AuthButton>

            <Collapse in={Boolean(gqlErrors)} style={{ width: '100%' }}>
              <AuthErrors>
                {gqlErrors?.map(({ message }) => message)}
              </AuthErrors>
            </Collapse>
          </AuthForm>
        </FormikProvider>
      </AuthBox>
    </AuthContainer>
  );
};
