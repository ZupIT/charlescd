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
import Button from 'core/components/Button';
import RadioGroup from 'core/components/RadioGroup';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { getProfileByKey } from 'core/utils/profile';
import { useGit } from './hooks';
import { radios } from './constants';
import { GitFormData } from './interfaces';
import { Props } from '../interfaces';
import Styled from './styled';
import { buildTestConnectionPayload } from './helpers';
import { testGitConnection } from 'core/providers/workspace';
import { useTestConnection } from 'core/hooks/useTestConnection';
import ConnectionStatus from 'core/components/ConnectionStatus';

const FormGit = ({ onFinish }: Props) => {
  const { responseAdd, save, loadingSave, loadingAdd } = useGit();
  const [gitType, setGitType] = useState('');
  const {
    response: testConnectionResponse,
    loading: loadingConnectionResponse,
    save: testConnection
  } = useTestConnection(testGitConnection);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid }
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
  const profileId = getProfileByKey('id');

  useEffect(() => {
    if (responseAdd) {
      onFinish();
    }
  }, [onFinish, responseAdd]);

  useEffect(() => {
    if (gitType === 'GitHub') {
      setValue('credentials.address', 'https://github.com');
    } else if (gitType === 'GitLab') {
      setValue('credentials.address', 'https://gitlab.com');
    }
  }, [setValue, gitType]);

  const onSubmit = (git: GitFormData) => {
    save({
      ...git,
      authorId: profileId,
      credentials: {
        ...git.credentials,
        serviceProvider: gitType.toUpperCase()
      }
    });
  };

  const handleTestConnection = () => {
    const data = getValues();

    console.log('data', data);
    const payload = buildTestConnectionPayload(data, gitType);
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
          name="credentials.address"
          label={`Enter the ${gitType} url`}
        />
        <Form.Password
          ref={register({ required: true })}
          name="credentials.accessToken"
          label={`Enter the token ${gitType}`}
        />
        {!loadingConnectionResponse && testConnectionResponse && (
          <ConnectionStatus message={testConnectionResponse} />
        )}
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
      <Button.Default type="submit" isLoading={loadingSave || loadingAdd}>
        Save
      </Button.Default>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Styled.Title color="light">Add Git</Styled.Title>
      <Styled.Info color="dark">
        Adding a Git allows Charles to create, delete and merge branches as well
        as view repositories and generate releases. Consult our{' '}
        <Styled.Link
          href="https://docs.charlescd.io/get-started/defining-a-workspace/github"
          target="_blank"
        >
          documentation
        </Styled.Link>{' '}
        for further details.
      </Styled.Info>
      <Styled.Subtitle color="dark">
        Choose witch one you want to add:
      </Styled.Subtitle>
      <RadioGroup
        name="git"
        items={radios}
        onChange={({ currentTarget }) => setGitType(currentTarget.value)}
      />
      {gitType && renderForm()}
    </Styled.Content>
  );
};

export default FormGit;
