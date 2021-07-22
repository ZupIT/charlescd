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
import { Control, Controller } from 'react-hook-form';
import Select from './Select';
import { Option } from '../interfaces';

export interface Props {
  name: string;
  control: Control<any>;
  options: Option[];
  rules?: Partial<{ required: boolean | string }>;
  defaultValue?: Option;
  className?: string;
  label?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  onChange?: (value: Option) => void;
  onInputChange?: (value: string) => void;
  customOption?: React.ReactNode;
  closeMenuOnSelect?: boolean;
  hideSelectedOptions?: boolean;
  hasError?: boolean;
}

const Single = ({
  name,
  control,
  options,
  rules,
  defaultValue,
  className,
  label,
  onChange,
  onInputChange,
  isDisabled = false,
  isLoading = false,
  customOption,
  closeMenuOnSelect = true,
  hideSelectedOptions,
  hasError
}: Props) => (
  <div data-testid={`select-${name}`}>
    <Controller
      render={({ onChange: onControllerChange }) => {
        return (
          <Select
            placeholder={label}
            className={className}
            isDisabled={isDisabled}
            isLoading={isLoading}
            customOption={customOption}
            onInputChange={onInputChange}
            defaultValue={defaultValue}
            closeMenuOnSelect={closeMenuOnSelect}
            hideSelectedOptions={hideSelectedOptions}
            options={options}
            hasError={hasError}
            onChange={selected => {
              onChange?.(selected);
              onControllerChange(selected?.value);

              return selected?.value;
            }}
          />
        );
      }}
      defaultValue={defaultValue?.value ?? ''}
      rules={rules}
      control={control}
      name={name}
    />
  </div>
);

export default Single;
