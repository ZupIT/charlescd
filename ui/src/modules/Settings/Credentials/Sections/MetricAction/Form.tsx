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
import { useForm, FormContext } from 'react-hook-form';
import Text from 'core/components/Text';
import Card from 'core/components/Card';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { normalizeSelectOptions } from 'core/utils/select';
import Button from 'core/components/Button';
import { usePlugins } from './hooks';
import { Props } from '../interfaces';
import Styled from './styled';
import { ActionPayload } from './types';
import { configType as configOptions } from './constants';

const FormAddAction = ({ onFinish }: Props) => {
  const [loadingPlugins, setLoadingPlugins] = useState(true);
  const [configType, setConfigType] = useState('');
  const [pluginsOptions, setPluginsOptions] = useState([]);
  const formMethods = useForm<ActionPayload>({ mode: 'onChange' });
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { isValid }
  } = formMethods;
  const nickname = watch('nickname') as string;

  const { getPlugins } = usePlugins();

  useEffect(() => {
    setLoadingPlugins(true);
    getPlugins('action')
      .then(pluginsResponse => {
        const normalizedOptions = normalizeSelectOptions(pluginsResponse);
        setPluginsOptions(normalizedOptions);
      })
      .finally(() => setLoadingPlugins(false));
  }, [getPlugins]);

  const onSubmit = (data: ActionPayload) => {
    console.log(data);
    // const filtersPayload = data.filters?.map(({ id, ...rest }) => {
    //   return id ? { id, ...rest } : rest;
    // });
    // const payload = {
    //   ...data,
    //   id: metric?.id,
    //   circleId: metric?.circleId,
    //   filters: filtersPayload ?? [],
    //   threshold: Number(data.threshold)
    // };

    // saveMetric(id, payload)
    //   .then(response => {
    //     if (response) {
    //       onGoBack();
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  };

  const renderActionConfig = () => (
    <>
      <Card.Config
        icon="action"
        description={nickname}
        onClose={() => console.log('reset Form')}
      />
      <Styled.OptionText color="dark">
        You select an action configuration in a basic way or fill an advanced
        one.
      </Styled.OptionText>
      <Styled.RadioGroupButtom
        name="action-config-type"
        items={configOptions}
        onChange={({ currentTarget }) => setConfigType(currentTarget.value)}
      />
      {configType === configOptions[1].value && (
        <Styled.Input
          name="configuration"
          ref={register()}
          label="Enter a action configuration"
        />
      )}
    </>
  );

  const renderForm = () => (
    <>
      <Styled.Input
        name="nickname"
        ref={register({ required: true })}
        label="Type a nickname"
        maxLength={100}
      />
      <Styled.Input
        name="description"
        ref={register({ required: true })}
        label="Type a description"
      />
      <Styled.Select
        control={control}
        name="type"
        label="Select a plugin"
        isLoading={loadingPlugins}
        options={pluginsOptions}
        rules={{ required: true }}
      />
      {isValid && renderActionConfig()}
    </>
  );

  return (
    <Styled.Content>
      <Text.h2 color="light" weight="bold">
        Add Action config
        <Popover
          title="What is a action?"
          icon="info"
          link={`${CHARLES_DOC}/reference/metrics`}
          linkLabel="View documentation"
          description="You can create an action and add a trigger to perform an aitomatic task."
        />
      </Text.h2>
      <FormContext {...formMethods}>
        <Styled.Form
          onSubmit={handleSubmit(onSubmit)}
          data-testid="create-action"
        >
          {renderForm()}
          <Button.Default
            id="save"
            type="submit"
            isDisabled={!isValid}
            // isLoading={loadingSave || loadingAdd}
          >
            Save
          </Button.Default>
        </Styled.Form>
      </FormContext>
    </Styled.Content>
  );
};

export default FormAddAction;
