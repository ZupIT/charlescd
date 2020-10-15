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

import React, { useEffect, useState } from 'react';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { useForm } from 'react-hook-form';
import Button from 'core/components/Button/Default';
import Styled from './styled';
import CustomOption from 'core/components/Form/Select/CustomOptions';
import debounce from 'debounce-promise';
import { useCirclesData } from 'modules/Circles/hooks';
import { normalizeSelectOptions } from 'core/utils/select';
import { createActionPayload, normalizeActionsOptions } from './helpers';
import { useActionTypes, useSaveAction } from './hooks';
import { ActionGroupPayload, MetricsGroup, Action } from './types';

type Props = {
  onGoBack: Function;
  metricsGroup: MetricsGroup;
  circleId: string;
  action?: Action;
};

export type ActionForm = {
  nickname: string;
  actionId: string;
  circleId?: string;
};

const AddAction = ({ onGoBack, metricsGroup, circleId, action }: Props) => {
  const {
    handleSubmit,
    register,
    errors,
    control,
    formState: { isValid }
  } = useForm<ActionForm>({ mode: 'onChange', defaultValues: action ?? {} });
  const { saveAction } = useSaveAction(action?.id);
  const { getAllActionsTypesData } = useActionTypes();
  const [actionsTypeResponse, setActionsTypeResponse] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const { getCirclesData } = useCirclesData();

  console.log(action);

  useEffect(() => {
    getAllActionsTypesData().then(response => {
      setActionsTypeResponse(response);
    });
  }, [getAllActionsTypesData]);

  const onSubmit = (data: ActionForm) => {
    const newPayload: ActionGroupPayload = createActionPayload(
      data,
      metricsGroup,
      circleId,
      selectedAction
    );
    saveAction(newPayload);
  };

  const loadCirclesByName = debounce(
    name =>
      getCirclesData({ name, active: true }).then(response =>
        normalizeSelectOptions(response.content)
      ),
    500
  );

  return (
    <div data-testid="metric-group-action-form">
      <Styled.Layer>
        <Styled.Icon
          name="arrow-left"
          color="dark"
          onClick={() => onGoBack()}
        />
      </Styled.Layer>
      <Styled.Layer>
        <Text.h2 color="light">
          {action?.id ? 'Update action' : 'Add action'}
        </Text.h2>
      </Styled.Layer>
      <Styled.Layer>
        <Text.h5 color="dark">
          {`Fill in the information below to ${
            action?.id ? 'update' : 'create'
          } an action.`}
        </Text.h5>
      </Styled.Layer>
      <Styled.Form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="create-metric"
      >
        <Styled.Layer>
          <Styled.Input
            name="nickname"
            ref={register({ required: true })}
            label="Type a nickname for action"
            maxLength={100}
          />
          {!!errors.nickname && (
            <Styled.FieldErrorWrapper>
              <Icon name="error" color="error" />
              <Text.h6 color="error">{errors.nickname.message}</Text.h6>
            </Styled.FieldErrorWrapper>
          )}
          <Styled.Select
            control={control}
            name="actionId"
            customOption={CustomOption.Description}
            options={normalizeActionsOptions(actionsTypeResponse)}
            onChange={e => setSelectedAction(e?.type)}
            label="Select a action type"
            isDisabled={false}
          />
          {selectedAction === 'circledeployment' && (
            <Styled.SelectAsync
              control={control}
              name="circleId"
              options={[]}
              label="Select a user group"
              isDisabled={false}
              loadOptions={loadCirclesByName}
            />
          )}
          <Button
            type="submit"
            isLoading={false}
            isDisabled={!isValid}
            id="submit"
          >
            Save
          </Button>
        </Styled.Layer>
      </Styled.Form>
    </div>
  );
};

export default AddAction;
