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


test('render Menu', () => {
  const { getByText, getByTestId } = render(
    <Menu
      actions={menuFilterItemsMock}
      active={menuFilterItemsMock[0].name}
      onSelect={jest.fn()}
    >
       content
    </Menu>
  );
  const menuContentElement = getByText('content');
  fireEvent.click(menuContentElement);
  expect(getByTestId('icon-checkmark')).toBeInTheDocument();
  expect(menuContentElement).toBeInTheDocument();
});

test('trigger Menu actions', () => {
  const { getByText, getAllByText } = render(
    <Menu actions={menuFilterItemsMock} onSelect={jest.fn()}>
       content
    </Menu>
  );

  const menuContentElement = getByText('content');
  fireEvent.click(menuContentElement);
  const actionsElements = getAllByText(/Action/);
  expect(actionsElements.length).toBe(2);
  expect(menuContentElement).toBeInTheDocument();
  fireEvent.click(menuContentElement);
  wait(() => expect(actionsElements.length).toBe(0));
});

test('trigger Menu select action', () => {
  const onSelect = jest.fn();
  const { getByText, getAllByText } = render(
    <Menu actions={menuFilterItemsMock} onSelect={onSelect}>
       content
    </Menu>
  );
  const menuContentElement = getByText('content');
  fireEvent.click(menuContentElement);
  const actionsElements = getAllByText(/Action/);
  fireEvent.click(actionsElements[0]);
  expect(onSelect).toHaveBeenCalledWith('first_action');
  wait(() => expect(actionsElements.length).toBe(0));
});
