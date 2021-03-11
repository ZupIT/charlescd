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
import { render, screen, waitFor, act, waitForElementToBeRemoved } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { Action as MenuAction } from '..';
import Menu from '..';

const menuFilterItemsMock: MenuAction[] = [
  {
    label: 'Action 1',
    name: 'first_action',
    icon: 'charles'
  },
  {
    label: 'Action 2',
    name: 'second_action'
  }
];


test('render Menu', async() => {
  render(
    <Menu
      actions={menuFilterItemsMock}
      active={menuFilterItemsMock[0].name}
      onSelect={jest.fn()}
    >
       content
    </Menu>
  );
  const menuContentElement = screen.getByText('content');
  expect(menuContentElement).toBeInTheDocument();

  act(() => userEvent.click(menuContentElement));
  expect(screen.getByTestId('icon-checkmark')).toBeInTheDocument();
});

test('trigger Menu actions', async() => {
  render(
    <Menu actions={menuFilterItemsMock} onSelect={jest.fn()}>
       content
    </Menu>
  );

  const menuContentElement = screen.getByText('content');
  act(() => userEvent.click(menuContentElement));
  
  const actionsElements = screen.getAllByText(/Action/);
  expect(actionsElements).toHaveLength(2);
  expect(menuContentElement).toBeInTheDocument();

  userEvent.click(menuContentElement);
  expect(screen.queryByText(/Action/)).not.toBeInTheDocument();
});

test('trigger Menu select action', async () => {
  const onSelect = jest.fn();

  render(
    <Menu actions={menuFilterItemsMock} onSelect={onSelect}>
       content
    </Menu>
  );

  const menuContentElement = screen.getByText('content');
  act(() => userEvent.click(menuContentElement));
  
  const actionsElements = screen.getAllByText(/Action/);
  
  userEvent.click(actionsElements[0]);

  expect(onSelect).toHaveBeenCalledWith('first_action');
  await waitFor(() => {
    expect(screen.queryAllByText(/Action/)).toHaveLength(0);
  })
});
