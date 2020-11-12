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
import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import InputAction from '..';

const onClick = jest.fn();

const props = {
  name: 'test',
  icon: 'copy',
  defaultValue: '123457'
};

test('render InputAction component', () => {
  render(
    <InputAction { ... props } onClick={onClick} />
  );

  const element = screen.getByTestId(`input-action-${props.name}`);
  expect(element).toBeInTheDocument();
});

test('render InputAction component and fire action', () => {
  render(
    <InputAction { ... props } onClick={onClick} />
  );
  
  const button = screen.getByTestId(`input-action-${props.name}-button`);
  userEvent.click(button);

  expect(onClick).toHaveBeenCalledTimes(1);
});

