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
import { useFormContext, ArrayField } from 'react-hook-form';
import { useFindAllModules } from 'modules/Modules/hooks/module';
import { Option } from 'core/components/Form/Select/interfaces';
import {
  formatModuleOptions,
  formatTagOptions,
  formatComponentOptions
} from './helpers';
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
  const [tagOptions, setTagOptions] = useState([]);
  const prefixName = `modules[${index}]`;
  const {
    getComponentTags,
    response: tags,
    loading: loadingTags
  } = useComponentTags();
  const { errors, control, getValues } = useFormContext();

  useEffect(() => {
    getAllModules();
  }, [getAllModules]);

  useEffect(() => {
    if (modules) {
      setModuleOptions(formatModuleOptions(modules.content));
    }
  }, [modules]);

  useEffect(() => {
    if (tags) {
      setTagOptions(formatTagOptions(tags));
    }
  }, [tags]);

  const updateComponents = (option: Option) => {
    setComponentOptions(formatComponentOptions(modules.content, option?.value));
  };

  const getErrorMessage = (name: string) => {
    return errors?.modules?.[index]?.[name]?.message;
  };

  const listVersions = (option: Option) => {
    const moduleId = getValues(`${prefixName}.module`);
    const componentId = option?.value;
    getComponentTags(moduleId, componentId);
    setTagOptions([]);
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
          onChange={listVersions}
          rules={{ required: true }}
          control={control}
        />
        <Styled.Error color="error">
          {getErrorMessage('component')}
        </Styled.Error>
      </Styled.SelectWrapper>
      <Styled.SelectWrapper>
        <Styled.Select
          name={`${prefixName}.version`}
          label="Select a version"
          isLoading={loadingTags}
          control={control}
          rules={{ required: true }}
          options={tagOptions}
        />
      </Styled.SelectWrapper>
    </Styled.Module.Wrapper>
  );
};

export default Module;
