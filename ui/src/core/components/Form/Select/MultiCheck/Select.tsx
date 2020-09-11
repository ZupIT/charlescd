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
import { ActionMeta, ValueType, OptionTypeBase } from 'react-select';
import { ReactComponent as DownSVG } from 'core/assets/svg/down.svg';
import { Props, Option } from '../interfaces';
import customStyles from '../customStyle';
import { allOption } from './constants';
import Styled from '../styled';
import { handleChange } from './helpers';
import MultiValue from './MultiValue';
import ValueContainer from './ValueContainer';

const Select = ({
  options,
  onChange,
  customOption,
  label,
  ...otherProps
}: Props) => {
  return (
    <Styled.Select
      {...otherProps}
      isMulti
      placeholder={label}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      styles={customStyles}
      isClearable={false}
      isSearchable={false}
      options={[allOption, ...options]}
      components={{
        Option: customOption,
        MultiValue,
        ValueContainer,
        IndicatorSeparator: null,
        DropdownIndicator: () => <DownSVG />
      }}
      onChange={(
        value: ValueType<OptionTypeBase>,
        actionMeta: ActionMeta<OptionTypeBase>
      ) => handleChange(value as Option[], actionMeta, onChange, options)}
    />
  );
};

export default Select;
