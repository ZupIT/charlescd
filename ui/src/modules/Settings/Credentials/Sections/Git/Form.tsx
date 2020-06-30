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
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { getProfileByKey } from 'core/utils/profile';
import { useGit } from './hooks';
import { radios } from './constants';
import { Git } from './interfaces';
import { Props } from '../interfaces';
import Styled from './styled';

const FormGit = ({ onFinish }: Props) => {
  const { responseAdd, save, loadingSave, loadingAdd } = useGit();
  const [gitType, setGitType] = useState('');
  const { register, handleSubmit } = useForm<Git>();
  const profileId = getProfileByKey('id');

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  const onSubmit = (git: Git) => {
    save({
      ...git,
      name: `${gitType} Configuration`,
      authorId: profileId,
      credentials: {
        ...git.credentials,
        serviceProvider: gitType.toUpperCase()
      }
    });
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
        <Form.Input
          ref={register({ required: true })}
          name="credentials.address"
          label={`Enter the ${gitType} url`}
        />
        <Form.Input
          ref={register({ required: true })}
          name="credentials.accessToken"
          label={`Enter the token ${gitType}`}
        />
      </Styled.Fields>
      <Button.Default type="submit" isLoading={loadingSave || loadingAdd}>
        Save
      </Button.Default>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Styled.Title color="light">
        Add Git
        <Popover
          title="Why we need a Git?"
          icon="info"
          link={`${CHARLES_DOC}/primeiros-passsos/configurando-workspace/github`}
          linkLabel="View documentation"
          description="Adding a Git allows Charles to create, delete and merge branches as well as view repositories and generate releases. Consult our documentation for further details."
        />
      </Styled.Title>
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
