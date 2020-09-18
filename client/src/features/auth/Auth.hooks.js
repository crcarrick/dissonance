import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  useDeepEqualCallback,
  useDeepEqualEffect,
  useMutation,
  useRouter,
} from '@dissonance/hooks';

export const useAuth = ({ initialValues, mutation }) => {
  const { history } = useRouter();

  const [mutate, { data, error, loading }] = useMutation(mutation);

  const handleSubmit = useDeepEqualCallback(
    (values) => mutate({ variables: { input: { ...values } } }),
    [mutate]
  );

  useDeepEqualEffect(() => {
    if (data) {
      const token = (data.loginUser || data.signupUser).token;

      localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN, token);

      history.push('/servers');
    }
  }, [data]);

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
