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
import isEmpty from 'lodash/isEmpty';
import { useForm } from 'react-hook-form';
import Card from 'core/components/Card';
import Button from 'core/components/Button';
import Select from 'core/components/Form/Select';
import { Option } from 'core/components/Form/Select/interfaces';
import Text from 'core/components/Text';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { getProfileByKey } from 'core/utils/profile';
import { MetricProvider } from './interfaces';
import { Props } from '../interfaces';
import { useMetricProvider } from './hooks';
import { metricProviders } from './constants';
import Styled from './styled';

const FormMetricProvider = ({ onFinish }: Props) => {
  const { responseAdd, save, loadingSave, loadingAdd } = useMetricProvider();
  const [isDisabled, setIsDisabled] = useState(true);
  const [provider, setProvider] = useState<Option>();
  const { control, register, handleSubmit } = useForm<MetricProvider>();

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  const onSubmit = (metricProvider: MetricProvider) => {
    save({
      ...metricProvider,
      authorId: getProfileByKey('id'),
      provider: provider.value
    });
  };

  const onChange = (option: Option) => {
    setProvider(option);
    setIsDisabled(!isEmpty(option));
  };

  const onClose = () => {
    setProvider(null);
    setIsDisabled(true);
  };

  const renderFields = () => (
    <>
      <Card.Config
        icon={provider.icon}
        description={provider.label}
        onClose={() => onClose()}
      />
      <Styled.Input
        ref={register}
        name="url"
        label="Insert the url"
        onChange={({ currentTarget }) => setIsDisabled(!currentTarget.value)}
      />
    </>
  );

  const renderSelect = () => (
    <Select.Single
      control={control}
      name="url"
      label="Select a type server"
      options={metricProviders}
      onChange={option => onChange(option)}
    />
  );

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      {provider ? renderFields() : renderSelect()}
      <Button.Default
        type="submit"
        isLoading={loadingSave || loadingAdd}
        isDisabled={isDisabled}
      >
        Save
      </Button.Default>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Text.h2 color="light">
        Add Metrics Provider
        <Popover
          title="Why we ask for Metrics Provider?"
          icon="info"
          link={`${CHARLES_DOC}/reference/metrics`}
          linkLabel="View documentation"
          description="Adding the URL of our tool helps Charles to metrics generation since this can vary from workspace to another. Consult the our documentation for further details."
        />
      </Text.h2>
      {renderForm()}
    </Styled.Content>
  );
};

export default FormMetricProvider;
