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

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import Icon from 'core/components/Icon';
import Form from 'core/components/Form';
import { validFields } from 'core/utils/validation';
import routes from 'core/constants/routes';
import Styled from '../styled';
import { useLogin } from './hook';

const Login = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const { register, errors, getValues, watch, handleSubmit } = useForm({
    mode: 'onChange'
  });
  const { doLogin, status, error } = useLogin();
  const history = useHistory();
  const watchFields = watch();

  useEffect(() => {
    setIsDisabled(!validFields(getValues()));
  }, [getValues, watchFields, setIsDisabled]);

  useEffect(() => {
    if (status === 'resolved') {
      history.push({ pathname: routes.workspaces });
    }
  }, [status, history]);

  const onSubmit = () => {
    const { email, password } = getValues();
    doLogin(email, password);
  };

  return (
    <>
      <Icon name="charles-logo" />
      <Styled.Form onSubmit={handleSubmit(onSubmit)}>
        <Styled.Title color="light">
          Sign in with your Charles Account
        </Styled.Title>
        <Styled.Error color="error">{error}</Styled.Error>
        <Styled.Field>
          <Form.Input
            type="email"
            ref={register({ required: true })}
            name="email"
            label="Email address"
          />
          {errors.email && (
            <Styled.Error color="error">Required Field</Styled.Error>
          )}
        </Styled.Field>
        <Styled.Field>
          <Form.Password
            ref={register({ required: true })}
            name="password"
            label="Enter your password"
          />
          {errors.password && (
            <Styled.Error color="error">Required Field</Styled.Error>
          )}
        </Styled.Field>
        <Styled.Button
          type="submit"
          size="EXTRA_SMALL"
          isDisabled={isDisabled}
          isLoading={status === 'pending'}
        >
          Continue
        </Styled.Button>
      </Styled.Form>
    </>
  );
};

export default Login;
