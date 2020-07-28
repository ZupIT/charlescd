import React, { useState, useCallback } from 'react';
import Text from 'core/components/Text';
import Button from 'core/components/Button';
import { useForm } from 'react-hook-form';
import Styled from './styled';
import CheckPassword from 'core/components/CheckPassword';

const ChangePassword = () => {
  const { register, handleSubmit, watch } = useForm();
  const password = watch('password');
  const confirmPass = watch('confirmPassword');
  const [isCheckedPassword, setCheckedPassword] = useState(false);

  const onSubmit = (data: any) => {
    console.log('data', data);
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
      <Button.Default
        type="submit"
        size="EXTRA_SMALL"
        isDisabled={!isCheckedPassword}
      >
        Save
      </Button.Default>
    </Styled.ChangePassword>
  );
};

export default ChangePassword;
