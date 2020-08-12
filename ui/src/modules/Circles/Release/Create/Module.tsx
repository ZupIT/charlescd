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

import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext, ArrayField } from 'react-hook-form';
import { useFindAllModules } from 'modules/Modules/hooks/module';
import { Option } from 'core/components/Form/Select/interfaces';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { formatModuleOptions, formatComponentOptions } from './helpers';
import { useComponentTags } from '../hooks';
import Styled from '../styled';

interface Props {
  index: number;
  onClose: () => void;
  isNotUnique?: boolean;
  module?: Partial<ArrayField<Record<string, string>, 'id'>>;
}

const Module = ({ index, onClose, isNotUnique }: Props) => {
  const { getAllModules, response: modules } = useFindAllModules();
  const [moduleOptions, setModuleOptions] = useState([]);
  const [componentOptions, setComponentOptions] = useState([]);
  const [isEmptyTag, setIsEmptyTag] = useState(false);
  const prefixName = `modules[${index}]`;
  const { getComponentTag, status } = useComponentTags();
  const {
    errors,
    register,
    control,
    getValues,
    setValue,
    clearError
  } = useFormContext();

  useEffect(() => {
    getAllModules();
  }, [getAllModules]);

  useEffect(() => {
    if (modules) {
      setModuleOptions(formatModuleOptions(modules.content));
    }
  }, [modules]);

  const resetVersion = () => {
    setValue(`${prefixName}.tag`, '');
    setValue(`${prefixName}.version`, '');
    clearError([`${prefixName}.tag`, `${prefixName}.version`]);
    setIsEmptyTag(false);
  };

  const updateComponents = (option: Option) => {
    setComponentOptions(formatComponentOptions(modules.content, option?.value));
    resetVersion();
  };

  const getErrorMessage = (name: string) => {
    return errors?.modules?.[index]?.[name]?.message;
  };

  const checkTagByName = async (
    moduleId: string,
    componentId: string,
    name: string
  ) => {
    setValue(`${prefixName}.tag`, '');
    const tag = await getComponentTag(moduleId, componentId, { name });
    setValue(`${prefixName}.tag`, tag?.artifact);
    setIsEmptyTag(isEmpty(tag?.artifact));
  };

  const onSearchTag = () => {
    const componentId = getValues(`${prefixName}.component`);
    const moduleId = getValues(`${prefixName}.module`);
    const name = getValues(`${prefixName}.version`);

    checkTagByName(moduleId, componentId, name);
  };

  return (
    <Styled.Module.Wrapper>
      {isNotUnique && (
        <Styled.Module.Trash>
          <Styled.Module.Icon
            name="trash"
            color="light"
            onClick={() => onClose()}
          />
        </Styled.Module.Trash>
      )}
      <Styled.SelectWrapper>
        <Styled.Select
          name={`${prefixName}.module`}
          label="Select a module"
          options={moduleOptions}
          onChange={updateComponents}
          control={control}
          rules={{ required: true }}
        />
      </Styled.SelectWrapper>
      <Styled.SelectWrapper>
        <Styled.Select
          name={`${prefixName}.component`}
          label="Select a component"
          options={componentOptions}
          onChange={resetVersion}
          rules={{ required: true }}
          control={control}
        />
        <Styled.Error color="error">
          {getErrorMessage('component')}
        </Styled.Error>
      </Styled.SelectWrapper>
      <Styled.SelectWrapper>
        <Styled.Module.Input
          type="hidden"
          name={`${prefixName}.tag`}
          ref={register({ required: true })}
        />
        <Styled.Module.Input
          name={`${prefixName}.version`}
          ref={register({ required: true })}
          onChange={useCallback(debounce(onSearchTag, 300), [])}
          isLoading={status.isPending}
          hasError={isEmptyTag}
          label="Version name"
        />
        {isEmptyTag && (
          <Styled.Error color="error">
            This version is not in the configured registry.
          </Styled.Error>
        )}
      </Styled.SelectWrapper>
    </Styled.Module.Wrapper>
  );
};

export default Module;
