import React from 'react';

import { useField } from 'formik';

import { AuthInput } from './AuthField.style';

const AuthInputLabel = ({ error, text }) => (
  <span>
    {text}
    {error && (
      <span>
        {' '}
        - <em>{error}</em>
      </span>
    )}
  </span>
);

export const AuthField = (props) => {
  const [field, { error, touched, value }] = useField({ ...props });

  return (
    <AuthInput
      {...field}
      {...props}
      variant="outlined"
      size="small"
      fullWidth={true}
      error={Boolean(touched && error)}
      value={value}
      label={
        <AuthInputLabel
          text={props.name.toUpperCase()}
          error={touched && error}
        />
      }
      InputLabelProps={{ shrink: true }}
    />
  );
};
