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
import { testGitConnection } from 'core/providers/workspace';
import { useTestConnection } from 'core/hooks/useTestConnection';
import ConnectionStatus from 'core/components/ConnectionStatus';
import Button from 'core/components/Button';
import Radio from 'core/components/Radio';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { useGit } from './hooks';
import { radios } from './constants';
import { GitFormData } from './interfaces';
import { Props } from '../interfaces';
import { buildConnectionPayload } from './helpers';
import isEqual from 'lodash/isEqual';
import Styled from './styled';

const FormGit = ({ onFinish }: Props) => {
  const { responseAdd, save, loadingSave, loadingAdd } = useGit();
  const [gitType, setGitType] = useState('');
  const [lastTestedForm, setLastTestedForm] = useState<GitFormData>();
  const {
    response: testConnectionResponse,
    loading: loadingConnectionResponse,
    save: testConnection,
    reset: resetTestConnection
  } = useTestConnection(testGitConnection);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
    watch
  } = useForm<GitFormData>({
    mode: 'onChange',
    defaultValues: {
      credentials: {
        address: '.',
        accessToken: '',
        serviceProvider: ''
      }
    }
  });

  const form = watch();

  useEffect(() => {
    if (testConnectionResponse && testConnectionResponse.message) {
      if (!isEqual(form, lastTestedForm)) {
        resetTestConnection();
      }
    }
  }, [form, testConnectionResponse, resetTestConnection, lastTestedForm]);

  useEffect(() => {
    if (responseAdd) {
      onFinish();
    }
  }, [onFinish, responseAdd]);

  const onSubmit = (git: GitFormData) => {
    save({
      ...git,
      credentials: {
        ...buildConnectionPayload(git, gitType).credentials
      }
    });
  };

  const handleTestConnection = () => {
    const data = getValues();
    setLastTestedForm(data);
    const payload = buildConnectionPayload(data, gitType);
    testConnection(payload);
  };

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Text.h5 color="dark">
        Fill in the fields below with your information:
      </Text.h5>
      <Styled.Fields>
        <Form.Input
          ref={register({ required: true })}
          name="name"
          label={`Type a name for ${gitType}`}
        />
        {gitType !== 'GitHub' && (
          <Form.Input
            ref={register({ required: true })}
            name="credentials.address"
            label={`Enter the ${gitType} url`}
          />
        )}

        <Form.Input
          ref={register({ required: true })}
          name="credentials.accessToken"
          label={`Enter the token ${gitType}`}
        />
        <ConnectionStatus
          successMessage="Successful connection with git."
          errorMessage={testConnectionResponse?.message}
          status={testConnectionResponse?.status}
        />
        <Styled.TestConnectionButton
          id="test-connection"
          type="button"
          onClick={handleTestConnection}
          isLoading={loadingConnectionResponse}
          isDisabled={!isValid}
        >
          Test connection
        </Styled.TestConnectionButton>
      </Styled.Fields>
      <Button.Default
        type="submit"
        isDisabled={!isValid}
        isLoading={loadingSave || loadingAdd}
      >
        Save
      </Button.Default>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Styled.Title color="light">Add Git</Styled.Title>
      <Styled.Info color="dark" data-testid="git-help-text">
        Adding a Git allows Charles to create, delete and merge branches, as
        well as view repositories and generate releases. Consult our{' '}
        <Styled.Link
          href="https://docs.charlescd.io/get-started/defining-a-workspace/github"
          target="_blank"
        >
          documentation
        </Styled.Link>{' '}
        for further details.
      </Styled.Info>
      <Styled.Subtitle color="dark">
        Choose which one you want to add:
      </Styled.Subtitle>
      <Radio.Buttons
        name="git"
        items={radios}
        onChange={({ currentTarget }) => setGitType(currentTarget.value)}
      />
      {gitType && renderForm()}
    </Styled.Content>
  );
};

export default FormGit;
