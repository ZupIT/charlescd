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
import { render, screen, fireEvent } from 'unit-test/testUtils';
import CustomOption from 'core/components/Form/Select/CustomOptions';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from 'react-hook-form';
import AsyncSelect from '../Async';

test('render async select component', () => {
  const options = [{ value: 'apple', label: 'apple', icon: 'user' }];
  const onChange = jest.fn();
  const loadOptions = jest.fn();

  const { result } = renderHook(() => useForm());
  const { control } = result.current;

  render(
    <AsyncSelect
      control={control}
      name="select"
      label="Select..."
      customOption={CustomOption.Icon}
      options={options}
      loadOptions={loadOptions}
      onChange={onChange}
    />
  );

  expect(screen.getByTestId('select-select')).toBeInTheDocument();
});

test('should call loadOptions', () => {
  const options = [
    { value: 'apple', label: 'apple', icon: 'user' },
    { value: 'banana', label: 'banana', icon: 'user' },
  ];
  const onChange = jest.fn();
  const loadOptions = jest.fn();

  const { result } = renderHook(() => useForm());
  const { control } = result.current;

  const { container } = render(
    <AsyncSelect
      control={control}
      name="select"
      label="Select..."
      customOption={CustomOption.Icon}
      options={options}
      loadOptions={loadOptions}
      onChange={onChange}
    />
  );

  const select = container.getElementsByTagName('INPUT');
  fireEvent.change(select[0], { target: { value: 'ap' }});

  expect(loadOptions).toBeCalled();
});