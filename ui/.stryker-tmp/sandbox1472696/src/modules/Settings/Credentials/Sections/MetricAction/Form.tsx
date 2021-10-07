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
import { useForm, FormProvider } from 'react-hook-form';
import CardConfig from 'core/components/Card/Config';
import { normalizeSelectOptions } from 'core/utils/select';
import ButtonDefault from 'core/components/Button/ButtonDefault';
import { usePlugins, useCreateAction } from './hooks';
import { Props } from '../interfaces';
import Styled from './styled';
import { ActionForm, ActionPayload } from './types';
import { buildActionPayload } from './helpers';
import Link from 'core/components/Link';
import {
  isRequired,
  urlPattern,
  isRequiredAndNotBlank,
  isNotBlank,
  trimValue,
} from 'core/utils/validations';
import { CHARLES_DOC } from 'core/components/Popover';

const actionPlaceholder = 'charlescd-custom-path-example';

const FormAddAction = ({ onFinish }: Props<ActionForm>) => {
  const [loadingPlugins, setLoadingPlugins] = useState(true);
  const [showConfigAction, setShowConfigAction] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const [pluginsOptions, setPluginsOptions] = useState([]);
  const formMethods = useForm<ActionForm>({
    mode: 'onChange',
    defaultValues: {
      configuration: 'https://',
    },
  });
  const {
    handleSubmit,
    register,
    control,
    watch,
    errors,
    formState: { isValid },
  } = formMethods;
  const nickname = watch('nickname') as string;
  const configuration = watch('configuration') as string;

  const { getPlugins } = usePlugins();
  const { createAction, status } = useCreateAction();

  useEffect(() => {
    setShowPlaceholder(['https://', 'http://'].includes(configuration));
  }, [configuration]);

  useEffect(() => {
    setLoadingPlugins(true);
    getPlugins('action')
      .then((pluginsResponse) => {
        const normalizedOptions = normalizeSelectOptions(pluginsResponse);
        setPluginsOptions(normalizedOptions);
      })
      .finally(() => setLoadingPlugins(false));
  }, [getPlugins]);

  const onSubmit = (data: ActionForm) => {
    const payload = buildActionPayload(data, isDefault) as ActionPayload;

    createAction(payload)
      .then((response) => {
        if (response) {
          onFinish();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderActionConfig = () => (
    <>
      <CardConfig
        icon="action"
        description={nickname}
        onClose={() => setShowConfigAction(false)}
      />
      <Styled.OptionText tag="H5" color="dark">
        You select an action configuration in a basic way or fill an advanced
        one.
      </Styled.OptionText>
      <Styled.ButtonGroup>
        <Styled.ButtonIconRounded
          color="dark"
          onClick={() => setIsDefault(true)}
          isActive={isDefault}
        >
          Default
        </Styled.ButtonIconRounded>
        <Styled.ButtonIconRounded
          color="dark"
          onClick={() => setIsDefault(false)}
          isActive={!isDefault}
        >
          Custom path
        </Styled.ButtonIconRounded>
      </Styled.ButtonGroup>
      {!isDefault && (
        <Styled.Wrapper>
          <Styled.Input
            name="configuration"
            ref={register({
              required: isRequired(),
              validate: {
                notBlank: isNotBlank,
              },
              setValueAs: trimValue,
              pattern: urlPattern(),
            })}
            error={errors?.configuration?.message}
            label="Enter a action configuration"
          />
          {showPlaceholder && (
            <Styled.Placeholder tag="H4" color="light">
              {actionPlaceholder}
            </Styled.Placeholder>
          )}
        </Styled.Wrapper>
      )}
      <ButtonDefault
        id="save"
        type="submit"
        isDisabled={!isValid}
        isLoading={status.isPending}
      >
        Save
      </ButtonDefault>
    </>
  );

  const renderForm = () => (
    <Styled.FormContent showForm={!showConfigAction}>
      <Styled.Input
        name="nickname"
        ref={register(isRequiredAndNotBlank)}
        label="Type a nickname"
        maxLength={100}
      />
      <Styled.Input
        name="description"
        ref={register(isRequiredAndNotBlank)}
        label="Type a description"
        maxLength={100}
      />
      <Styled.Select
        control={control}
        name="type"
        label="Select a plugin"
        isLoading={loadingPlugins}
        options={pluginsOptions}
        rules={{ required: true }}
      />
      <ButtonDefault
        id="next"
        isDisabled={!isValid}
        onClick={() => setShowConfigAction(true)}
      >
        Next
      </ButtonDefault>
    </Styled.FormContent>
  );

  return (
    <Styled.Content data-testid="add-action-form">
      <Styled.Title tag="H2" color="light">Add Metric Action</Styled.Title>
      <Styled.Info tag="H5" color="dark" data-testid="text-metric-action">
        You can create an action and add a trigger to perform an automatic task.
        See our{' '}
        <Link href={`${CHARLES_DOC}/reference/metrics/action`}>
          documentation
        </Link>{' '}
        for further details.
      </Styled.Info>
      <FormProvider {...formMethods}>
        <Styled.Form
          onSubmit={handleSubmit(onSubmit)}
          data-testid="create-action"
        >
          {renderForm()}
          {showConfigAction && renderActionConfig()}
        </Styled.Form>
      </FormProvider>
    </Styled.Content>
  );
};

export default FormAddAction;
