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

import React from 'react';
import { components } from 'react-select';
import { ReactComponent as DownSVG } from 'core/assets/svg/down.svg';
import SingleValue from 'core/components/Form/Select/SingleValue';
import FloatingLabel from 'core/components/Form/Select/FloatingLabel';
import customStyles from '../customStyle';
import { Props, Option } from '../interfaces';
import Styled from '../styled';
import { isEmpty } from 'lodash';

const Select = ({
  placeholder,
  options,
  defaultValue,
  defaultOptions,
  className,
  isDisabled = false,
  onChange,
  onInputChange,
  customOption,
  loadOptions,
  hasError
}: Props) => {
  const selectDefaultOptions = isEmpty(defaultOptions) ? true : defaultOptions;

  return (
    <div data-testid="react-select">
      <Styled.AsyncSelect
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        placeholder={placeholder}
        hasError={hasError}
        components={{
          ValueContainer: FloatingLabel,
          Option: customOption ? customOption : components.Option,
          SingleValue,
          IndicatorSeparator: null,
          DropdownIndicator: () => <DownSVG />
        }}
        styles={customStyles}
        cacheOptions
        options={options}
        defaultOptions={selectDefaultOptions}
        loadOptions={loadOptions}
        onInputChange={onInputChange}
        onChange={(option: Option) => onChange(option)}
      />
    </div>
  );
};

export default Select;
