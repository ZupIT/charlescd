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

import React, { useEffect, useState } from 'react';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import ButtonDefault from 'core/components/Button/ButtonDefault';
import routes from 'core/constants/routes';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { maxLength, isRequired, emailPattern } from 'core/utils/validations';
import { NewUser } from 'modules/Users/interfaces/User';
import Styled from './styled';
import { useCreateUser } from '../hooks';
import { updateParam } from 'core/utils/path';
import { useHistory } from 'react-router-dom';
import useForm from 'core/hooks/useForm';

interface Props {
  onFinish: (createUserStatus: string) => void;
}

const FormUser = ({ onFinish }: Props) => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    errors,
    formState: { isValid }
  } = useForm<NewUser>({ mode: 'onChange' });
  const { create, newUser } = useCreateUser();
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (newUser) {
      onFinish('Created');
      updateParam(
        'user',
        routes.usersComparation,
        history,
        'create',
        newUser.email
      );
    }
  }, [newUser, history, onFinish]);

  const onSubmit = async ({pwd, ...user}: NewUser) => {
    setStatus('idle');
    await create({ ...user, root: false, password: pwd });
    setStatus('completed');
  };

  const renderForm = () => (
    <Styled.Form
      data-testid="form-create-user"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Styled.Fields>
        <Form.Input
          {...register('name', {
            required: isRequired(),
            maxLength: maxLength(64)
          })}
          label="User name"
          error={errors?.name?.message}
        />
        <Form.Input
          {...register('email', {
            required: isRequired(),
            maxLength: maxLength(64),
            pattern: emailPattern()
          })}
          label="E-mail"
          error={errors?.email?.message}
        />
        <Form.Password
          {...register('pwd', {
            required: isRequired(),
            maxLength: maxLength(100)
          })}
          label="Create password"
          error={errors?.pwd?.message}
        />
      </Styled.Fields>
      <ButtonDefault
        data-testid="button-create-user"
        size="EXTRA_SMALL"
        type="submit"
        isDisabled={!isValid}
        isLoading={status === 'idle'}
      >
        Create User
      </ButtonDefault>
    </Styled.Form>
  );

  return (
    <Styled.Content data-testid="content-create-user">
      <Styled.Title tag="H2">
        <Text tag="H2" weight="bold" color="light">
          Create User
        </Text>
        <Popover
          title="Creating a new user"
          icon="info"
          link={`${CHARLES_DOC}/reference/users-group`}
          linkLabel="View documentation"
          description="In order to create a new user, you must fill the following fields."
        />
      </Styled.Title>
      <Styled.Subtitle tag="H5" color="dark">
        Enter the requested information bellow:
      </Styled.Subtitle>
      {renderForm()}
    </Styled.Content>
  );
};

export default FormUser;
