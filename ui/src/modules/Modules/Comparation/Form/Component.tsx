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
import useForm from 'core/hooks/useForm';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import keys from 'lodash/keys';
import isEqual from 'lodash/isEqual';
import { Component as IComponent } from 'modules/Modules/interfaces/Component';
import { Module } from 'modules/Modules/interfaces/Module';
import Can from 'containers/Can';
import {
  useSaveComponent,
  useUpdateComponent
} from 'modules/Modules/hooks/component';
import routes from 'core/constants/routes';
import { updateParam } from 'core/utils/path';
import { validFields } from './helpers';
import Styled from './styled';
import { maxLength } from 'core/utils/validations';

interface MoreOptionsModel {
  name: string;
  latencyThreshold: string;
  errorThreshold: string;
}

interface Props {
  component: IComponent;
  module: Module;
  onClose: Function;
  onUpdate: Function;
}

const Component = ({ component, module, onClose, onUpdate }: Props) => {
  const { register, handleSubmit, watch, getValues, errors } = useForm({mode: 'onChange'});
  const [isDisabled, setIsDisabled] = useState(true);
  const {
    saveComponent,
    loading,
    response: savedComponent
  } = useSaveComponent();
  const { updateComponent, response: updatedComponent } = useUpdateComponent();
  const watchFields = watch();
  const isEdit = !isEmpty(component);
  const history = useHistory();
  const [isAdvancedOptions, setIsAdvancedOptions] = useState(false);

  useEffect(() => {
    const form = getValues();
    const moreOptionsModel: MoreOptionsModel = {
      name: '',
      latencyThreshold: '',
      errorThreshold: ''
    };
    const restForm = pick(form, keys(moreOptionsModel));
    const isInvalid = !validFields(restForm);
    const comp = {
      name: component?.name || '',
      latencyThreshold: component?.latencyThreshold?.toString() || '',
      errorThreshold: component?.errorThreshold?.toString() || '',
      hostValue: component?.hostValue?.toString() || '',
      gatewayName: component?.gatewayName?.toString() || ''
    };
    setIsDisabled(isEqual(comp, form) || isInvalid);
  }, [watchFields, getValues, component]);

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

  const renderMoreOptions = () => (
    <Styled.Components.AdvancedOptions>
      <Styled.Input
        {...register('hostValue')}
        label="Enter host value"
        defaultValue={component?.hostValue}
      />
      <Styled.Input
        {...register('gatewayName')}
        label="Enter gateway name"
        defaultValue={component?.gatewayName}
      />
    </Styled.Components.AdvancedOptions>
  )

  return (
    <Styled.Content>
      <Styled.Icon name="arrow-left" color="dark" onClick={() => onClose()} />
      <Styled.Title tag="H2" color="light">
        {isEdit ? 'Edit component' : 'Create component'}
      </Styled.Title>
      <Styled.Subtitle tag="H5" color="dark">
        use the fields below to add the component:
      </Styled.Subtitle>
      <Styled.Form onSubmit={handleSubmit(onSubmit)}>
        <Styled.Input
          {...register('name', { 
            required: true,
            maxLength: maxLength(50) 
          })}
          label="Enter name component"
          defaultValue={component?.name}
          error={errors?.name?.message}
        />
        <Styled.Number
          {...register('latencyThreshold', { required: true })}
          label="Latency Threshold (ms)"
          defaultValue={component?.latencyThreshold}
        />
        <Styled.FieldPopover>
          <Styled.Number
            {...register('errorThreshold', { required: true })}
            label="Http Error Threshold (%)"
            defaultValue={component?.errorThreshold}
          />
        </Styled.FieldPopover>
        <Styled.Subtitle
          tag="H5"
          data-testid="subtitle-advanced-options"
          onClick={() => setIsAdvancedOptions(!isAdvancedOptions)}
          color="dark"
        >
          {isAdvancedOptions ? 'Hide ' : 'Show '}
          advanced options (be careful, do not change this if you are not using
          istio gateway)
        </Styled.Subtitle>
        {isAdvancedOptions && renderMoreOptions()}
        <Can I="write" a="modules" isDisabled={isDisabled} passThrough>
          <Styled.Button
            id="save-edit-module"
            type="submit"
            size="EXTRA_SMALL"
            isLoading={loading}
          >
            Save
          </Styled.Button>
        </Can>
      </Styled.Form>
    </Styled.Content>
  );
};

export default Component;
