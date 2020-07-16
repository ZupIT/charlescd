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
import first from 'lodash/first';
import { useForm } from 'react-hook-form';
import Button from 'core/components/Button';
import Form from 'core/components/Form';
import RadioGroup from 'core/components/RadioGroup';
import Text from 'core/components/Text';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { getProfileByKey } from 'core/utils/profile';
import { useRegistry } from './hooks';
import { radios } from './constants';
import { Registry } from './interfaces';
import { Props } from '../interfaces';
import Styled from './styled';

const FormRegistry = ({ onFinish }: Props) => {
  const { responseAdd, save, loadingSave, loadingAdd } = useRegistry();
  const [registryType, setRegistryType] = useState('');
  const { register, unregister, handleSubmit, reset } = useForm<Registry>();
  const profileId = getProfileByKey('id');

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  const onChange = (value: string) => {
    reset();
    setRegistryType(value);
  };

  const onSubmit = (registry: Registry) => {
    registry = {
      ...registry,
      authorId: profileId,
      provider: registryType
    };

    save(registry);
  };

  const renderAwsFields = () => {
    unregister('username');
    unregister('password');

    return (
      <>
        <Form.Password
          ref={register}
          name="accessKey"
          label="Enter the access key"
        />
        <Form.Input
          ref={register}
          name="secretKey"
          label="Enter the secret key"
        />
        <Form.Input ref={register} name="region" label="Enter the region" />
      </>
    );
  };

  const renderAzureFields = () => {
    unregister('accessKey');
    unregister('secretKey');
    unregister('region');

    return (
      <>
        <Form.Input ref={register} name="username" label="Enter the username" />
        <Form.Password
          ref={register}
          name="password"
          label="Enter the password"
        />
      </>
    );
  };

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Text.h5 color="dark">
        Fill in the fields below with your information:
      </Text.h5>
      <Styled.Fields>
        <Form.Input
          ref={register}
          name="name"
          label="Type a name for Registry"
        />
        <Form.Input
          ref={register}
          name="address"
          label="Enter the registry url"
        />
        {registryType === first(radios).value
          ? renderAwsFields()
          : renderAzureFields()}
      </Styled.Fields>
      <Button.Default type="submit" isLoading={loadingSave || loadingAdd}>
        Save
      </Button.Default>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Styled.Title color="light">
        Add Registry
        <Popover
          title="Why we need a Registry?"
          icon="info"
          link={`${CHARLES_DOC}/get-started/defining-a-workspace/docker-registry`}
          linkLabel="View documentation"
          description="Adding your Docker Registry allows Charles to watch for new images being generated and list all the images saved in your registry in order to deploy them. Consult our documentation for further details. "
        />
      </Styled.Title>
      <Styled.Subtitle color="dark">
        Choose witch one you want to add:
      </Styled.Subtitle>
      <RadioGroup
        name="registry"
        items={radios}
        onChange={({ currentTarget }) => onChange(currentTarget.value)}
      />
      {registryType && renderForm()}
    </Styled.Content>
  );
};

export default FormRegistry;
