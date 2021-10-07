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
// @ts-nocheck


import { useState, useEffect } from 'react';
import ButtonDefault from 'core/components/Button/ButtonDefault';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { CHARLES_DOC } from 'core/components/Popover';
import { useRegistry } from './hooks';
import { options } from './constants';
import { Registry } from './interfaces';
import { Props } from '../interfaces';
import Styled from './styled';
import Switch from 'core/components/Switch';
import Message from 'core/components/Message';
import CustomOption from 'core/components/Form/Select/CustomOption';
import { Option } from 'core/components/Form/Select/interfaces';
import isEqual from 'lodash/isEqual';
import { useTestConnection } from 'core/hooks/useTestConnection';
import { testRegistryConnection } from 'core/providers/registry';
import Link from 'core/components/Link';
import { useForm } from 'react-hook-form';
import {
  isRequired,
  urlPattern,
  isRequiredAndNotBlank,
  isNotBlank,
  trimValue,
  validJSON,
} from 'core/utils/validations';
import Editor from 'core/components/Editor';

const registryPlaceholder: Option = {
  AZURE: 'example.azurecr.io',
  AWS: 'account_id.dkr.ecr.region.amazonaws.com',
  GCP: 'gcr.io',
  DOCKER_HUB: 'registry.hub.docker.com',
  HARBOR: 'harbor.exampleapi.com',
};

const FormRegistry = ({ onFinish }: Props<Registry>) => {
  const { save, responseAdd, loadingSave, loadingAdd } = useRegistry();
  const [registryType, setRegistryType] = useState('');
  const [registryName, setRegistryName] = useState('');
  const [awsUseSecret, setAwsUseSecret] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const [lastTestedForm, setLastTestedForm] = useState<Registry>();
  const {
    response: testConnectionResponse,
    loading: loadingConnectionResponse,
    save: testConnection,
    reset: resetTestConnection,
  } = useTestConnection(testRegistryConnection);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    errors,
    trigger,
    formState: { isValid },
  } = useForm<Registry>({
    mode: 'onChange',
    defaultValues: {
      address: 'https://',
      name: '',
      provider: null,
      jsonKey: '',
    },
  });

  const form = watch();
  const { address: addressListener } = form;

  /**
   * workaround to solve a test, because useevent type doesnt trigger formState validation
   */
  useEffect(() => {
    trigger();
  }, [form.jsonKey, trigger]);

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  useEffect(() => {
    if (registryType === 'DOCKER_HUB') {
      register('address', isRequiredAndNotBlank);
      setValue('address', 'https://registry.hub.docker.com');
    }
  }, [registryType, setValue, register]);

  useEffect(() => {
    if (testConnectionResponse && testConnectionResponse.message) {
      if (!isEqual(form, lastTestedForm)) {
        resetTestConnection();
      }
    }
  }, [form, testConnectionResponse, resetTestConnection, lastTestedForm]);

  useEffect(() => {
    setShowPlaceholder(['https://', 'http://'].includes(addressListener));
  }, [addressListener]);

  const onChange = (option: Option) => {
    reset();
    setRegistryType(option.value);
    setRegistryName(option.label);
  };

  const onClick = () => {
    const registry = {
      ...getValues(),
      provider: registryType,
    };
    setLastTestedForm(getValues());
    testConnection(registry);
  };

  const onSubmit = (registry: Registry) => {
    save({
      ...registry,
      provider: registryType,
    });
  };

  const renderAwsFields = () => {
    return (
      <>
        <Form.Input
          ref={register(isRequiredAndNotBlank)}
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
              ref={register(isRequiredAndNotBlank)}
              name="accessKey"
              label="Enter the access key"
            />
            <Form.Password
              ref={register(isRequiredAndNotBlank)}
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
          ref={register(isRequiredAndNotBlank)}
          name="organization"
          label="Enter the project id"
        />
        <Styled.Subtitle tag="H4" color="dark">
          Enter the json key below:
        </Styled.Subtitle>
        <Editor
          ref={register({
            ...isRequiredAndNotBlank,
            validate: {
              ...isRequiredAndNotBlank.validate,
              validJSON,
            },
          })}
          name="jsonKey"
          width="270px"
          height="190px"
        />
        <Text tag="H5" color="error">
          {errors?.jsonKey?.message}
        </Text>
      </>
    );
  };

  const renderLoginFields = () => {
    return (
      <>
        <Form.Input
          ref={register(isRequiredAndNotBlank)}
          name="username"
          label="Enter the username"
        />
        <Form.Password
          ref={register(isRequiredAndNotBlank)}
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
      <Text tag="H5" color="dark">
        Fill in the fields below with your {registryName} information:
      </Text>
      <Styled.Fields>
        <Form.Input
          ref={register(isRequiredAndNotBlank)}
          name="name"
          label="Type a name for Registry"
        />
        {registryType !== 'DOCKER_HUB' && (
          <>
            <Form.Input
              ref={register({
                required: isRequired(),
                validate: {
                  notBlank: isNotBlank,
                },
                setValueAs: trimValue,
                pattern: urlPattern(),
              })}
              error={errors?.address?.message}
              name="address"
              label="Enter the registry url"
            />
            {showPlaceholder && (
              <Styled.Placeholder tag="H4" color="light">
                {registryPlaceholder[registryType]}
              </Styled.Placeholder>
            )}
          </>
        )}
        {handleFields()}
        <Message
          successMessage={`Successful connection with ${registryName}.`}
          errorMessage={testConnectionResponse?.message}
          status={testConnectionResponse?.status}
        />
        <ButtonDefault
          type="button"
          id="test-connection"
          onClick={onClick}
          isDisabled={!isValid}
          isLoading={loadingConnectionResponse}
        >
          Test connection
        </ButtonDefault>
      </Styled.Fields>
      <ButtonDefault
        id="submit-registry"
        type="submit"
        isLoading={loadingSave || loadingAdd}
        isDisabled={!isValid}
      >
        Save
      </ButtonDefault>
    </Styled.Form>
  );

  const renderRegistryIcon = () => {
    if (registryType) {
      const registryChoose = options.filter(
        (item) => item.value === registryType
      );
      return registryChoose[0].icon;
    }
    return null;
  };

  return (
    <Styled.Content>
      <Styled.Title tag="H2" color="light">
        Add Registry
      </Styled.Title>
      <Text tag="H5" color="dark" data-testid="registry-help-text">
        Adding your Docker Registry allows Charles to watch for new images being
        generated and list all the images saved in your registry in order to
        deploy them. See our{' '}
        <Link href={`${CHARLES_DOC}/reference/registry`}>documentation</Link>{' '}
        for further details.
      </Text>
      <Styled.Select
        placeholder="Choose which one you want to add:"
        customOption={CustomOption.Icon}
        icon={renderRegistryIcon()}
        options={options}
        onChange={(option) => onChange(option as Option)}
      />
      {registryType && renderForm()}
    </Styled.Content>
  );
};

export default FormRegistry;
