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
import React from 'react';
import { render, screen, act } from 'unit-test/testUtils';
import Board from '..';

const props = {
  description: 'Description',
  onRemove: jest.fn(),
  onArchive: jest.fn(),
  onClick: jest.fn(),
}

test('render Card Board type ACTION', async () => {
  render(<Board type="ACTION" {...props } />);

  const Card = await screen.findByTestId(`card-board-ACTION-${props.description}`);
  expect(Card).toBeInTheDocument();
  
  act(() => userEvent.click(Card));
  expect(props.onClick).toBeCalled();

  const DropdownTrigger = await screen.findByTestId('icon-vertical-dots');
  expect(DropdownTrigger).toBeInTheDocument();
  act(() => userEvent.click(DropdownTrigger));

  const DropdownActions = await screen.findByTestId('dropdown-actions');
  expect(DropdownActions).toBeInTheDocument();
});

test('render Card Board type FEATURE', async () => {
  render(<Board type="FEATURE" {...props } />);

  const Card = await screen.findByTestId(`card-board-FEATURE-${props.description}`);
  expect(Card).toBeInTheDocument();

  act(() => userEvent.click(Card));
  expect(props.onClick).toBeCalled();

  const DropdownTrigger = await screen.findByTestId('icon-vertical-dots');
  expect(DropdownTrigger).toBeInTheDocument();
  act(() => userEvent.click(DropdownTrigger));

  const DropdownActions = await screen.findByTestId('dropdown-actions');
  expect(DropdownActions).toBeInTheDocument();
});
