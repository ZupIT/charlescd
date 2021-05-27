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

import { useEffect } from 'react';
import useForm from 'core/hooks/useForm';
import ButtonDefault from 'core/components/Button/Default';
import { CHARLES_DOC } from 'core/components/Popover';
import Form from 'core/components/Form';
import Select from 'core/components/Form/Select';
import Text from 'core/components/Text';
import DocumentationLink from 'core/components/DocumentationLink';
import { gitProviders } from './constants';
import { DeploymentConfiguration } from './interfaces';
import { Props } from '../interfaces';
import { useCDConfiguration } from './hooks';
import Styled from './styled';

const FormDeploymentConfiguration = ({ onFinish }: Props<DeploymentConfiguration>) => {
  const { responseAdd, save, loadingAdd, loadingSave } = useCDConfiguration();
  const formMethods = useForm<DeploymentConfiguration>({
    mode: 'onChange'
  });
  const { control, register, handleSubmit, formState: { isValid } } = formMethods;

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  const onSubmit = (deploymentConfiguration: DeploymentConfiguration) => {
    save(deploymentConfiguration);
  };

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Input
        ref={register({ required: true })}
        name="name"
        label="Type a name for the configuration"
      />
      <Form.Input
        ref={register({ required: true })}
        name="butlerUrl"
        label="Enter butler URL"
      />
      <Form.Input
        ref={register({ required: true })}
        name="namespace"
        label="Enter the namespace"
      />
      <Select.Single
        control={control}
        name="gitProvider"
        label="Choose the Git provider"
        options={gitProviders}
      />
      <Form.Input
        ref={register({ required: true })}
        name="gitToken"
        label="Enter the Git token"
      />
      <ButtonDefault
        type="submit"
        isDisabled={!isValid}
        isLoading={loadingAdd || loadingSave}
      >
        Save
      </ButtonDefault>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Text.h2 color="light">Add Deployment Configuration</Text.h2>
      <Text.h4 color="dark" data-testid="text-datasource">
        Adding your Deployment Configuration tool allows Charles to deploy artifacts and manage resources inside your Kubernetes cluster. See our{' '}
        <DocumentationLink
          text="documentation"
          documentationLink={`${CHARLES_DOC}/reference/cd-configuration`}
        />
        for further details.
      </Text.h4>
      {renderForm()}
    </Styled.Content>
  );
};

export default FormDeploymentConfiguration;
