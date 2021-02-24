/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';
import Text from 'core/components/Text';
import Button from 'core/components/Button';
import { useForm } from 'react-hook-form';
import { isRequired } from 'core/utils/validations';
import { validationResolver } from 'core/components/CheckPassword';
import { useChangePassword } from './hooks/useChangePassword';
import Styled from './styled';

type Props = {
  onSubmit?: () => void;
};

type FormState = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    errors,
    formState,
    getValues
  } = useForm<FormState>({
    mode: 'onChange',
    resolver: validationResolver
  });
  const newPassword = watch('newPassword') as string;
  const confirmPass = watch('confirmPassword') as string;
  const { updatePassword, status } = useChangePassword();

  useEffect(() => {
    if (status.isResolved) {
      onSubmit();
    }
  }, [status.isResolved, onSubmit]);

  const onSubmitForm = () => {
    const { oldPassword, newPassword } = getValues();
    updatePassword({ oldPassword, newPassword });
  };

  return (
    <Styled.ChangePassword onSubmit={handleSubmit(onSubmitForm)}>
      <Text.h2 color="light">Change password</Text.h2>
      <Styled.Modal.Info color="dark">
        Fill in the fields below to change your password:
      </Styled.Modal.Info>
      <Styled.Password
        label="Enter your current password"
        name="oldPassword"
        error={errors?.oldPassword?.message}
        ref={register({
          required: isRequired()
        })}
      />
      <Styled.Modal.Info color="dark">
        Your new password must be at least 10 characters long, uppercase,
        lowercase, numbers and at least one special character.
      </Styled.Modal.Info>
      <Styled.Password
        label="New password"
        name="newPassword"
        error={errors?.newPassword?.message}
        ref={register({
          required: isRequired()
        })}
      />
      <Styled.Password
        label="Confirm new password"
        name="confirmPassword"
        error={errors?.confirmPassword?.message}
        ref={register({
          required: isRequired()
        })}
      />
      <Styled.CheckPassword password={newPassword} confirmPass={confirmPass} />
      <Button.Default
        id="change-password"
        type="submit"
        size="EXTRA_SMALL"
        isLoading={status.isPending}
        isDisabled={!formState.isValid}
      >
        Save
      </Button.Default>
    </Styled.ChangePassword>
  );
};

export default ChangePassword;
