import React from 'react';
import Text from 'core/components/Text';
import Button from 'core/components/Button';
import { useForm } from 'react-hook-form';
import CheckPassword, {
  validationResolver
} from 'core/components/CheckPassword';
import Styled from './styled';

const ChangePassword = () => {
  const { register, handleSubmit, watch, errors } = useForm({
    mode: 'onBlur',
    validationResolver
  });
  const password = watch('password') as string;
  const confirmPass = watch('confirmPassword') as string;

  console.log('error', errors);

  const onSubmit = () => {
    console.log('submit');
  };

  return (
    <Styled.ChangePassword onSubmit={handleSubmit(onSubmit)}>
      <Text.h2 color="light">Change password</Text.h2>
      <Styled.Modal.Info color="dark">
        Fill in the fields below to change your password:
      </Styled.Modal.Info>
      <Styled.Password
        label="Enter your current password"
        name="oldPassword"
        ref={register({ required: true })}
      />
      <Styled.Modal.Info color="dark">
        Your new password must be at least 10 characters long, uppercase,
        lowercase, numbers and at least one special character.
      </Styled.Modal.Info>
      <Styled.Password
        label="New password"
        name="password"
        ref={register({ required: true })}
      />
      <Styled.Password
        label="Confirm new password"
        name="confirmPassword"
        ref={register({ required: true })}
      />
      <CheckPassword password={password} confirmPass={confirmPass} />
      <Button.Default type="submit" size="EXTRA_SMALL">
        Save
      </Button.Default>
    </Styled.ChangePassword>
  );
};

export default ChangePassword;
