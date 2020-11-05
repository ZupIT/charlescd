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

import userEvent from '@testing-library/user-event';
import { ThemeScheme } from 'core/assets/themes';
import { getTheme } from 'core/utils/themes';
import React from 'react';
import { render, screen, fireEvent, wait, within } from 'unit-test/testUtils';
import Checkbox from '..';

const theme = getTheme() as ThemeScheme;

test('render default (unchecked) Checkbox', () => {
  render(
    <Checkbox />
  );

  const checkboxIcon = screen.getByTestId('checkbox-icon');
  const icon = screen.getByTestId('checkbox-icon-svg');
  
  expect(checkboxIcon).toHaveStyle('width: 10px')
  expect(checkboxIcon).toHaveStyle('height: 10px')
  expect(checkboxIcon).toHaveStyle(
    `background: ${theme.checkbox.unchecked.background}`
  )
  expect(checkboxIcon).toHaveStyle(
    `border: 1px solid ${theme.checkbox.unchecked.borderColor}`
  )
  expect(icon).toHaveStyle('visibility: hidden;')
});

test('render checked Checkbox', () => {
  render(
    <Checkbox checked />
  );

  const checkboxIcon = screen.getByTestId('checkbox-icon');
  const icon = screen.getByTestId('checkbox-icon-svg');
  
  expect(checkboxIcon).toHaveStyle('width: 12px')
  expect(checkboxIcon).toHaveStyle('height: 12px')
  expect(checkboxIcon).toHaveStyle(
    `background: ${theme.checkbox.checked.background}`
  );
  expect(checkboxIcon).toHaveStyle('border: none');
  expect(icon).toHaveStyle('visibility: visible')
});

test('render checked and trigger onChange', () => {
  const handleChangeFn = jest.fn();

  render(
    <Checkbox onChange={handleChangeFn} checked />
  );

  const hiddenCheckbox = screen.getByTestId('hidden-checkbox');
  userEvent.click(hiddenCheckbox);

  expect(handleChangeFn).toHaveBeenCalled();
});