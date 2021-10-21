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
import { render, screen, act, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import routes from 'core/constants/routes';
import { FetchMock } from 'jest-fetch-mock';
import { saveProfile } from 'core/utils/profile';
import Account from '../';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

beforeAll(() => {
  saveProfile({ id: '123', name: 'User', email: 'user@zup.com.br' });
});

const profile = {
  id: '123',
  name: 'User',
  email: 'user@zup.com.br',
  photoUrl: 'https://charlescd.io/avatar1'
}

test('render account tab profile', async () => {
  const history = createMemoryHistory();
  history.push(routes.accountProfile);

  (fetch as FetchMock).mockResponse(JSON.stringify(profile));

  render(<Router history={history}><Account /></Router>);

  const tabElement = await screen.findByTestId('tabpanel-Account');
  expect(tabElement).toBeInTheDocument();
});

test('show change password modal', async () => {
  const history = createMemoryHistory();
  history.push(routes.accountProfile);

  (fetch as FetchMock).mockResponse(JSON.stringify(profile));

  render(<Router history={history}><Account /></Router>);

  const tabPanelElement = await screen.findByTestId('tabpanel-Account');
  expect(tabPanelElement).toBeInTheDocument();
  
  const changePassButton = await screen.findByTestId('labeledIcon-account');
  act(() => userEvent.click(changePassButton));

  const modalElement = await screen.findByTestId('modal-default');
  expect(modalElement).toBeInTheDocument();
});
