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
import { render, fireEvent, wait } from 'unit-test/testUtils';
import { dark as inputTheme } from 'core/assets/themes/input';
import SearchInput from '../';

test('renders search input component with default properties', () => {
  const { getByTestId } = render(<SearchInput onSearch={jest.fn} />);

  const iconElement = getByTestId('icon-search');

  expect(iconElement).toHaveStyle(`color: ${inputTheme.search.color};`);
  expect(iconElement).toBeInTheDocument();
});

test('trigger focus and blur events', () => {
  const { getByTestId } = render(<SearchInput onSearch={jest.fn} />);
  const element = getByTestId('input-text-search');

  fireEvent.focus(element);
  const iconElement = getByTestId('icon-search');

  expect(iconElement).toHaveStyle(`color: ${inputTheme.search.focus.color};`);
  fireEvent.blur(element);
  expect(iconElement).toHaveStyle(`color: ${inputTheme.search.color};`);
});

test('trigger change event', () => {
  const onSearch = jest.fn();
  const value = "Foo bar";
  const { getByTestId } = render(<SearchInput onSearch={onSearch} />);
  const element = getByTestId('input-text-search') as HTMLInputElement;

  fireEvent.change(element, { target: { value }});

  wait(() => {
    expect(onSearch).toHaveBeenCalledWith(value)
  })
});
