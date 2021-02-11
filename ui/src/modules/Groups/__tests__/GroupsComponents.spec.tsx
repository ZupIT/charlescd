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
import { render, screen, act } from 'unit-test/testUtils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import routes from 'core/constants/routes';
import Groups from '..';
import userEvent from '@testing-library/user-event';

test('render groups', async () => {
  const history = createMemoryHistory();
  history.push(routes.groups);

  render(<Router history={history}><Groups /></Router>);

  const UserGroupMenu = await screen.findByTestId('user-groups-menu');

  expect(UserGroupMenu).toBeInTheDocument();
});

test('render groups and open create modal', async () => {
  let ModalCreateUserGroup;
  const history = createMemoryHistory();
  history.push(routes.groups);

  render(<Router history={history}><Groups /></Router>);

  const ButtonCreateUserGroup = await screen.findByText('Create user group');
  expect(ButtonCreateUserGroup).toBeInTheDocument();
  
  await act(async () => userEvent.click(ButtonCreateUserGroup));

  ModalCreateUserGroup = await screen.findByTestId('modal-default');
  expect(ModalCreateUserGroup).toBeInTheDocument();

  const InputNameUserGroup = await screen.findByTestId('input-text-name');
  await act(async () => userEvent.type(InputNameUserGroup, 'group'));

  const SubmitNewUserGroup = await screen.findByTestId('button-default-user-group');
  await act(async () => userEvent.click(SubmitNewUserGroup));

  ModalCreateUserGroup = screen.queryByTestId('modal-default');
  expect(ModalCreateUserGroup).not.toBeInTheDocument();
});
