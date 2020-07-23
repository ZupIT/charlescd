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
import MutationObserver from 'mutation-observer';
import Form from '../index';
import userGroups from '../../../../../../stub/user-groups/mock';

(global as any).MutationObserver = MutationObserver;

test('render user group Form ', () => {
  const { getByTestId } = render(
    <Form
      userGroup={userGroups.userGroups.content[0]}
      onAddUser={jest.fn()}
      onEdit={jest.fn()}
    />
  );
  expect(
    getByTestId(`${userGroups.userGroups.content[0].name}`)
  ).toBeInTheDocument();
});

test('render user group Form with more then 8 users', async () => {
  const onAddUser = jest.fn();

  const { getByTestId } = render(
    <Form
      userGroup={userGroups.userGroups.content[1]}
      onAddUser={onAddUser}
      onEdit={jest.fn()}
    />
  );

  const userGroupForm = getByTestId(`${userGroups.userGroups.content[1].name}`);
  const countButton = getByTestId('count-users');

  expect(userGroupForm).toBeInTheDocument();
  expect(countButton).toBeInTheDocument();

  fireEvent.click(countButton);

  await wait(() => expect(onAddUser).toHaveBeenCalled());
});