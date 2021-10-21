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
import { render, screen, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { dark as inputTheme } from 'core/assets/themes/input';
import SearchInput from '../';

test('renders search input component with default properties', () => {
  render(<SearchInput onSearch={jest.fn} />);

  const iconElement = screen.getByTestId('icon-search');

  expect(iconElement).toBeInTheDocument();
  expect(iconElement).toHaveStyle(`color: ${inputTheme.search.color};`);
});

test('trigger focus and blur events', () => {
  render(<SearchInput onSearch={jest.fn} />);

  const inputSearchElement = screen.getByTestId('input-text-search');

  userEvent.click(inputSearchElement);
  expect(inputSearchElement).toHaveFocus();

  const iconElement = screen.getByTestId('icon-search');
  expect(iconElement).toHaveStyle(`color: ${inputTheme.search.focus.color};`);

  userEvent.tab();
 
  expect(iconElement).toHaveStyle(`color: ${inputTheme.search.color};`);
});

test('trigger change event', async () => {
  const onSearch = jest.fn();
  const value = "Foo bar";
  render(<SearchInput onSearch={onSearch} />);

  const element = screen.getByTestId('input-text-search');

  userEvent.type(element, value);
  
  await waitFor(() => expect(onSearch).toHaveBeenCalledWith(value));
});
