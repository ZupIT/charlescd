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
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import { Component as IComponent } from 'modules/Modules/interfaces/Component';
import { Module } from 'modules/Modules/interfaces/Module';
import Can from 'containers/Can';
import {
  useSaveComponent,
  useUpdateComponent
} from 'modules/Modules/hooks/component';
import routes from 'core/constants/routes';
import { updateParam } from 'core/utils/path';
import { validateNamespace } from './helpers';
import Styled from './styled';

interface Props {
  component: IComponent;
  module: Module;
  onClose: Function;
  onUpdate: Function;
}

const Component = ({ component, module, onClose, onUpdate }: Props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isValid }
  } = useForm<IComponent>({ mode: 'onBlur' });
  const {
    saveComponent,
    loading,
    response: savedComponent
  } = useSaveComponent();
  const { updateComponent, response: updatedComponent } = useUpdateComponent();
  const isEdit = !isEmpty(component);
  const history = useHistory();
  const [editMoreOptions, setEditMoreOptions] = useState(false);

  useEffect(() => {
    if (savedComponent) {
      updateParam(
        'module',
        routes.modulesComparation,
        history,
        module?.id,
        `${module?.id}~view`
      );
    }
  }, [savedComponent, history, module]);

  useEffect(() => {
    if (updatedComponent) {
      onUpdate();
    }
  }, [updatedComponent, onUpdate]);

  const onSubmit = (data: IComponent) => {
    if (isEdit) {
      updateComponent(module.id, component.id, data);
    } else {
      saveComponent(module.id, data);
    }
  };

  console.log(errors?.name?.message);

  return (
    <Styled.Content>
      <Styled.Icon name="arrow-left" color="dark" onClick={() => onClose()} />
      <Styled.Title color="light">
        {isEdit ? 'Edit component' : 'Create component'}
      </Styled.Title>
      <Styled.Subtitle color="dark">
        use the fields below to add the component:
      </Styled.Subtitle>
      <Styled.Form onSubmit={handleSubmit(onSubmit)}>
        <Styled.Input
          label="Enter name component"
          name="name"
          error={errors?.name?.message}
          defaultValue={component?.name}
          ref={register({ required: 'required field' })}
        />
        <Styled.Input
          label="Namespace where to deploy"
          name="namespace"
          error={errors?.namespace?.message}
          defaultValue={component?.namespace}
          ref={register({
            required: 'required field',
            validate: validateNamespace
          })}
        />
        <Styled.Number
          label="Latency Threshold (ms)"
          name="latencyThreshold"
          error={errors?.latencyThreshold?.message}
          defaultValue={component?.latencyThreshold}
          ref={register({ required: 'required field' })}
        />
        <Styled.FieldPopover>
          <Styled.Number
            label="Http Error Threshold (%)"
            name="errorThreshold"
            error={errors?.errorThreshold?.message}
            defaultValue={component?.errorThreshold}
            ref={register({ required: 'required field' })}
          />
        </Styled.FieldPopover>
        <Styled.Subtitle
          onClick={() => setEditMoreOptions(!editMoreOptions)}
          color="dark"
        >
          {editMoreOptions ? 'Hide ' : 'Show '}
          advanced options (be careful, do not change this if you are not using
          istio gateway)
        </Styled.Subtitle>
        <Styled.Components.AdvancedOptionWrapper
          showMoreOptions={editMoreOptions}
        >
          <Styled.Input
            label="Enter host value"
            name="hostValue"
            defaultValue={component?.hostValue}
            ref={register()}
          />
          <Styled.Input
            label="Enter gateway name"
            name="gatewayName"
            defaultValue={component?.gatewayName}
            ref={register()}
          />
        </Styled.Components.AdvancedOptionWrapper>
        <Can I="write" a="modules" isDisabled={!isValid} passThrough>
          <Styled.Button
            id="save-edit-module"
            type="submit"
            size="EXTRA_SMALL"
            isLoading={loading}
          >
            {isEdit ? 'Edit' : 'Save'}
          </Styled.Button>
        </Can>
      </Styled.Form>
    </Styled.Content>
  );
};

export default Component;
