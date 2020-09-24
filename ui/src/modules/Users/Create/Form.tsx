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
import { useForm } from 'react-hook-form';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import Button from 'core/components/Button';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { NewUser } from 'modules/Users/interfaces/User';
import Styled from './styled';
import { useCreateUser } from '../hooks';
import { updateParam } from 'core/utils/path';
import { useHistory } from 'react-router-dom';
import routes from 'core/constants/routes';

interface Props {
  onFinish: (createUserStatus: string) => void;
}

const FormUser = ({ onFinish }: Props) => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm<NewUser>({ mode: 'onChange' });
  const { create, newUser, status } = useCreateUser();

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

  const onSubmit = (user: NewUser) => {
    create({ ...user, isRoot: false });
  };

  const renderForm = () => (
    <Styled.Form
      data-testid="form-create-user"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Styled.Fields>
        <Form.Input
          ref={register({ required: true })}
          name="name"
          label="User name"
        />
        <Form.Input
          ref={register({ required: true })}
          name="email"
          label="E-mail"
        />
        <Form.Input ref={register} name="photoUrl" label="Avatar URL" />
        <Form.Password
          ref={register({ required: true })}
          name="password"
          label="Create password"
        />
      </Styled.Fields>
      <Button.Default
        data-testid="button-create-user"
        size="EXTRA_SMALL"
        type="submit"
        isDisabled={!isValid}
        isLoading={status.isPending}
      >
        Create User
      </Button.Default>
    </Styled.Form>
  );

  return (
    <Styled.Content data-testid="content-create-user">
      <Styled.Title>
        <Text.h2 weight="bold" color="light">
          Create User
        </Text.h2>
        <Popover
          title="Creating a new user"
          icon="info"
          link={`${CHARLES_DOC}/reference/users-group`}
          linkLabel="View documentation"
          description="In order to create a new user, you must fill the following fields."
        />
      </Styled.Title>
      <Styled.Subtitle color="dark">
        Enter the requested information bellow:
      </Styled.Subtitle>
      {renderForm()}
    </Styled.Content>
  );
};

export default FormUser;
