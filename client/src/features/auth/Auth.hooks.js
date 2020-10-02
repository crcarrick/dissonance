import { useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { GET_ME } from '@dissonance/data';
import { useRouter } from '@dissonance/hooks';

export const useAuth = ({ initialValues, mutation }) => {
  const { history } = useRouter();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mutate] = useMutation(mutation);
  const [getMe] = useLazyQuery(GET_ME);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const { data } = await mutate({ variables: { input: { ...values } } });

      localStorage.setItem(
        process.env.REACT_APP_AUTH_TOKEN,
        (data.login || data.signup).token
      );

      await getMe();

      setLoading(false);

      history.push('/');
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const form = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required('Email is required')
        .email('Email is invalid'),
      password: yup
        .string()
        .min(4, 'Password must be at least 4 characters')
        .required('Password is required'),
      username: yup.lazy(() => {
        return Object.keys(initialValues).includes('username')
          ? yup
              .string()
              .min(8, 'Username must be at least 8 characters')
              .max(16, 'Username must not exceed 16 characters')
              .required('Username is required')
          : yup.mixed().notRequired();
      }),
    }),
    validateOnBlur: false,
    validateOnChange: false,
  });

  return { form, gqlErrors: error?.graphQLErrors, loading };
};
