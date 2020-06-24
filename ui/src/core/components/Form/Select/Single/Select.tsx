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
import SingleValue from '../SingleValue';
import customStyles from '../customStyle';
import FloatingLabel from '../FloatingLabel';
import { Props, Option } from '../interfaces';
import Styled from '../styled';

const Select = ({
  placeholder,
  options,
  defaultValue,
  className,
  isDisabled = false,
  isLoading = false,
  onChange,
  onInputChange,
  customOption
}: Props) => (
  <div data-testid="react-select">
    <Styled.Select
      className={className}
      defaultValue={defaultValue}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isLoading={isLoading}
      components={{
        ValueContainer: FloatingLabel,
        Option: customOption ? customOption : components.Option,
        SingleValue,
        IndicatorSeparator: null,
        DropdownIndicator: () => <DownSVG />
      }}
      styles={customStyles}
      options={options}
      onChange={(option: Option) => onChange(option)}
      onInputChange={(value: string, actions: { action: string }) => {
        if (actions.action === 'input-change' && onInputChange) {
          onInputChange(value);
        }
      }}
    />
  </div>
);

export default Select;
