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
import isEmpty from 'lodash/isEmpty';
import first from 'lodash/first';
import Button from 'core/components/Button';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import RadioGroup from 'core/components/RadioGroup';
import Form from 'core/components/Form';
import Select from 'core/components/Form/Select';
import Text from 'core/components/Text';
import { getProfileByKey } from 'core/utils/profile';
import { radios, providers, gitProviders } from './constants';
import { CDConfiguration } from './interfaces';
import { Props } from '../interfaces';
import { useCDConfiguration } from './hooks';
import Styled from './styled';

const FormCDConfiguration = ({ onFinish }: Props) => {
  const { responseAdd, save, loadingAdd, loadingSave } = useCDConfiguration();
  const { control, register, handleSubmit } = useForm<CDConfiguration>();
  const [configType, setConfigType] = useState('');
  const [providerType, setProviderType] = useState('');
  const profileId = getProfileByKey('id');

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  const onSubmit = (cdConfiguration: CDConfiguration) => {
    save({
      ...cdConfiguration,
      type: `${configType}`,
      authorId: profileId,
      configurationData: {
        ...cdConfiguration.configurationData,
        provider: providerType
      }
    });
  };

  useEffect(() => {
    if (configType === 'SPINNAKER') setProviderType('');
  }, [configType]);

  const renderOthersFields = () =>
    providerType === 'GENERIC' && (
      <>
        <Form.Input
          ref={register({ required: true })}
          name="configurationData.host"
          label="Host"
        />
        <Form.Input
          ref={register({ required: true })}
          name="configurationData.clientCertificate"
          label="Client Certificate"
        />
        <Form.Input
          ref={register({ required: true })}
          name="configurationData.clientKey"
          label="Client Key"
        />
        <Form.Input
          ref={register({ required: true })}
          name="configurationData.caData"
          label="CA Data"
        />
      </>
    );

  const renderEKSFields = () =>
    providerType === 'EKS' && (
      <>
        <Form.Input
          ref={register({ required: true })}
          name="configurationData.aswSID"
          label="ASW SID"
        />
        <Form.Input
          ref={register({ required: true })}
          name="configurationData.aswSecret"
          label="AWS Secret"
        />
        <Form.Input
          ref={register({ required: true })}
          name="configurationData.aswRegion"
          label="AWS Region"
        />
        <Form.Input
          ref={register({ required: true })}
          name="configurationData.aswClusterName"
          label="AWS Cluster Name"
        />
      </>
    );

  const renderCDConfigurationFields = () => (
    <>
      <Select.Single
        control={control}
        name="configurationData.gitProvider"
        label="Git provider"
        options={gitProviders}
      />
      <Form.Input
        ref={register({ required: true })}
        name="configurationData.gitToken"
        label="Git token"
      />
      <Styled.Subtitle color="dark">
        Choose the deployment manager:
      </Styled.Subtitle>
      <RadioGroup
        name="cd-configuration-provider"
        items={providers}
        onChange={({ currentTarget }) => setProviderType(currentTarget.value)}
      />
      {renderOthersFields()}
      {renderEKSFields()}
    </>
  );

  const renderSpinnakerFields = () => (
    <>
      <Form.Input
        ref={register({ required: true })}
        name="configurationData.url"
        label="Enter the URL Spinnaker"
      />
      <Form.Input
        ref={register({ required: true })}
        name="configurationData.gitAccount"
        label="Enter the git account"
      />
      <Form.Input
        ref={register({ required: true })}
        name="configurationData.account"
        label="Enter the kubernetes account"
      />
    </>
  );

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Text.h5 color="dark">
        Fill in the fields below with your information:
      </Text.h5>
      <Styled.Fields>
        <Form.Input
          ref={register({ required: true })}
          name="name"
          label="Type a name for configuration:"
        />
        <Form.Input
          ref={register({ required: true })}
          name="configurationData.namespace"
          label="Enter the namespace"
        />
        {configType === first(radios).value
          ? renderCDConfigurationFields()
          : renderSpinnakerFields()}
      </Styled.Fields>
      <Button.Default
        type="submit"
        isDisabled={
          !isEmpty(providerType) || configType === 'SPINNAKER' ? false : true
        }
        isLoading={loadingAdd || loadingSave}
      >
        Save
      </Button.Default>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Styled.Title color="light">
        Add CD Configuration
        <Popover
          title="Why we need a CD Configuration?"
          icon="info"
          link={`${CHARLES_DOC}/reference/cd-configuration`}
          linkLabel="View documentation"
          description="Add your Continuous Deployment (CD) tool allows Charles to deploy artifacts and manage resources inside your Kubernetes cluster. Consult our documentation for further details."
        />
      </Styled.Title>
      <Styled.Subtitle color="dark">
        Choose witch one you want to add:
      </Styled.Subtitle>
      <RadioGroup
        name="cd-configuration"
        items={radios}
        onChange={({ currentTarget }) => setConfigType(currentTarget.value)}
      />
      {configType && renderForm()}
    </Styled.Content>
  );
};

export default FormCDConfiguration;
