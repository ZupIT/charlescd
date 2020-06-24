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
import SelectComponent, {
  ActionMeta,
  ValueType,
  components,
  MultiValueProps,
  OptionTypeBase
} from 'react-select';
import Text from 'core/components/Text';
import { Props, Option } from '../interfaces';
import customStyles from '../customStyle';
import { allOption } from './constants';

const ValueContainer = ({ children, ...props }: any) => {
  const currentValues = props.getValue();
  let toBeRendered = children;

  if (currentValues.some((val: any) => val.value === '*')) {
    toBeRendered = [[children[0][0]], children[1]];
  } else if (currentValues.length) {
    const label = `${currentValues.length} selected`;
    toBeRendered = [label, children[1]];
  }

  return (
    <components.ValueContainer {...props}>
      <Text.h4 color="light">{toBeRendered}</Text.h4>
    </components.ValueContainer>
  );
};

const MultiValue = (props: MultiValueProps<OptionTypeBase>) => {
  let labelToBeDisplayed = `${props.data.label}, `;
  if (props.data.value === '*') {
    labelToBeDisplayed = 'All is selected';
  }
  return <span>{labelToBeDisplayed}</span>;
};

const Select = ({ options, onChange, customOption, ...otherProps }: Props) => {
  const handleChange = (selected: Option[], event: ActionMeta) => {
    if (selected !== null && selected.length > 0) {
      if (selected[selected.length - 1].value === allOption.value) {
        return onChange([allOption, ...options]);
      }
      let result: Option[] = [];
      if (selected.length === options.length) {
        if (selected.includes(allOption)) {
          result = selected.filter(option => option.value !== allOption.value);
        } else if (event.action === 'select-option') {
          result = [allOption, ...options];
        }
        return onChange(result);
      }
    }

    return onChange(selected);
  };

  return (
    <SelectComponent
      {...otherProps}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      styles={customStyles}
      options={[allOption, ...options]}
      components={{
        Option: customOption,
        MultiValue,
        ValueContainer
      }}
      onChange={(value: ValueType<OptionTypeBase>, actionMeta: ActionMeta) =>
        handleChange(value as Option[], actionMeta)
      }
    />
  );
};

export default Select;
