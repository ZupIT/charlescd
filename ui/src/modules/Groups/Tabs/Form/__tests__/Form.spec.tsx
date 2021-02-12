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
import { render } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Form from '../index';
import { mockUserGroup1, mockUserGroup2 } from './fixtures';

test('render user group Form ', () => {
  const { getByTestId } = render(
    <Form
      userGroup={mockUserGroup1}
      onAddUser={jest.fn()}
      onEdit={jest.fn()}
    />
  );

  expect(
    getByTestId(`${mockUserGroup1.name}`)
  ).toBeInTheDocument();
});

test('render user group Form with more then 8 users', async () => {
  const onAddUser = jest.fn();

  const { getByTestId } = render(
    <Form
      userGroup={mockUserGroup2}
      onAddUser={onAddUser}
      onEdit={jest.fn()}
    />
  );

  const userGroupForm = getByTestId(`${mockUserGroup2.name}`);
  const countButton = getByTestId('count-users');

  expect(userGroupForm).toBeInTheDocument();
  expect(countButton).toBeInTheDocument();

  userEvent.click(countButton);

  expect(onAddUser).toHaveBeenCalled();
});
