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
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { useRegistry, useRegistryTestConnection } from './hooks';
import { options } from './constants';
import { Registry } from './interfaces';
import { Props } from '../interfaces';
import Styled from './styled';
import Switch from 'core/components/Switch';
import AceEditorForm from 'core/components/Form/AceEditor';
import ConnectionStatus, { Props as ConnectionProps } from './ConnectionStatus';
import CustomOption from 'core/components/Form/Select/CustomOption';
import { Option } from 'core/components/Form/Select/interfaces';
import isEqual from 'lodash/isEqual';

const registryPlaceholder: Option = {
  AZURE: 'example.azurecr.io',
  AWS: 'account_id.dkr.ecr.region.amazonaws.com',
  GCP: 'gcr.io',
  DOCKER_HUB: 'registry.hub.docker.com',
  HARBOR: 'harbor.exampleapi.com'
};

const FormRegistry = ({ onFinish }: Props) => {
  const { save, responseAdd, loadingSave, loadingAdd } = useRegistry();
  const {
    testConnectionRegistry,
    response,
    error,
    status
  } = useRegistryTestConnection();
  const [registryType, setRegistryType] = useState('');
  const [registryName, setRegistryName] = useState('');
  const [awsUseSecret, setAwsUseSecret] = useState(false);
  const [message, setMessage] = useState<ConnectionProps>(null);
  const [messageForm, setMessageForm] = useState<Registry>();
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { isValid }
  } = useForm<Registry>({
    mode: 'onChange',
    defaultValues: {
      address: 'https://',
      name: '',
      provider: null,
      jsonKey: ''
    }
  });

  const form = watch();
  const { address: addressListener } = form;

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  useEffect(() => {
    if (registryType === 'DOCKER_HUB') {
      register('address');
      setValue('address', 'https://registry.hub.docker.com');
    }
  }, [registryType, setValue, register]);

  useEffect(() => {
    if (message && message.type) {
      if (!isEqual(form, messageForm)) {
        setMessage(null);
      }
    }
  }, [form, messageForm, message]);

  useEffect(() => {
    if (status.isResolved && response) {
      setMessageForm(getValues());
      setMessage({ type: 'success', message: 'Successful connection.' });
    }
  }, [status.isResolved, response, getValues]);

  useEffect(() => {
    if (error) {
      setMessageForm(getValues());
      setMessage({ type: 'error', message: error.message });
    }
  }, [error, getValues]);

  useEffect(() => {
    if (addressListener === 'https://' || addressListener === 'http://') {
      return setShowPlaceholder(true);
    } else {
      setShowPlaceholder(false);
    }
  }, [addressListener]);

  const onChange = (option: Option) => {
    reset();
    setMessage(null);
    setRegistryType(option.value);
    setRegistryName(option.label);
  };

  const onClick = () => {
    const registry = {
      ...getValues(),
      provider: registryType
    };
    testConnectionRegistry(registry);
  };

  const onSubmit = (registry: Registry) => {
    save({
      ...registry,
      provider: registryType
    });
  };

  const renderAwsFields = () => {
    return (
      <>
        <Form.Input
          ref={register({ required: true })}
          name="region"
          label="Enter the region"
        />
        <Switch
          name="aws-auth-handler"
          label="Enable access and secret key"
          active={awsUseSecret}
          onChange={() => setAwsUseSecret(!awsUseSecret)}
        />
        {awsUseSecret && (
          <>
            <Form.Password
              ref={register({ required: true })}
              name="accessKey"
              label="Enter the access key"
            />
            <Form.Password
              ref={register({ required: true })}
              name="secretKey"
              label="Enter the secret key"
            />
          </>
        )}
      </>
    );
  };

  const renderGCPFields = () => {
    return (
      <>
        <Form.Input
          ref={register({ required: true })}
          name="organization"
          label="Enter the project id"
        />
        <Styled.Subtitle color="dark">
          Enter the json key below:
        </Styled.Subtitle>
        <AceEditorForm
          width="270px"
          mode="json"
          name="jsonKey"
          rules={{ required: true }}
          control={control}
          theme="monokai"
        />
      </>
    );
  };

  const renderLoginFields = () => {
    return (
      <>
        <Form.Input
          ref={register({ required: true })}
          name="username"
          label="Enter the username"
        />
        <Form.Password
          ref={register({ required: true })}
          name="password"
          label="Enter the password"
        />
      </>
    );
  };

  const handleFields = () => {
    if (registryType === 'AWS') {
      return renderAwsFields();
    }

    if (registryType === 'GCP') {
      return renderGCPFields();
    }
    return renderLoginFields();
  };

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Text.h5 color="dark">
        Fill in the fields below with your {registryName} information:
      </Text.h5>
      <Styled.Fields>
        <Form.Input
          ref={register({ required: true })}
          name="name"
          label="Type a name for Registry"
        />
        {registryType !== 'DOCKER_HUB' && (
          <>
            <Form.Input
              ref={register({
                required: true,
                validate: {
                  methodValidate: (value: string) => {
                    if (value === 'https://' || value === 'http://') {
                      return false;
                    } else if (
                      value.includes('https://') ||
                      value.includes('http://')
                    ) {
                      return true;
                    }
                    return false;
                  }
                }
              })}
              name="address"
              label="Enter the registry url"
            />
            {showPlaceholder && (
              <Styled.StyledInputPlaceholder color="light">
                {registryPlaceholder[registryType]}
              </Styled.StyledInputPlaceholder>
            )}
          </>
        )}
        {handleFields()}
        {message && <ConnectionStatus {...message} />}
        <Button.Default
          type="button"
          id="test-connection"
          onClick={onClick}
          isDisabled={!isValid}
          isLoading={status.isPending}
        >
          Test connection
        </Button.Default>
      </Styled.Fields>
      <Button.Default
        id="submit-registry"
        type="submit"
        isLoading={loadingSave || loadingAdd}
        isDisabled={!isValid}
      >
        Save
      </Button.Default>
    </Styled.Form>
  );

  const returnRegistryIcon = () => {
    if (registryType) {
      const registryChoose = options.filter(
        item => item.value === registryType
      );
      return registryChoose[0].icon;
    }
    return null;
  };

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
      <Styled.Select
        placeholder="Choose which one you want to add:"
        customOption={CustomOption.Icon}
        icon={returnRegistryIcon()}
        options={options}
        onChange={option => onChange(option as Option)}
      />
      {registryType && renderForm()}
    </Styled.Content>
  );
};

export default FormRegistry;
