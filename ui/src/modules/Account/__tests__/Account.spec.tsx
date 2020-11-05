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
import { render, wait, fireEvent, screen, act } from 'unit-test/testUtils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import routes from 'core/constants/routes';
import { FetchMock } from 'jest-fetch-mock';
import MutationObserver from 'mutation-observer';
import Account from '../';
import { saveProfile } from 'core/utils/profile';
import userEvent from '@testing-library/user-event';

(global as any).MutationObserver = MutationObserver

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

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(profile));

  const { queryByTestId } = render(<Router history={history}><Account /></Router>);

  await wait(() => expect(queryByTestId('tabpanel-Account')).toBeInTheDocument());
});

test('show change password modal', async () => {
  const history = createMemoryHistory();
  history.push(routes.accountProfile);

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(profile));

  const { queryByTestId, getByTestId } = render(<Router history={history}><Account /></Router>);

  await wait(() => expect(queryByTestId('tabpanel-Account')).toBeInTheDocument());
  
  const changePassButton = getByTestId('labeledIcon-account');
  fireEvent.click(changePassButton);

  await wait(() => expect(queryByTestId('modal-default')).toBeInTheDocument());
});

test('to try update user profile', async () => {
  const history = createMemoryHistory();
  const newAvatarUrl = 'https://charlescd.io/avatar2';
  history.push(routes.accountProfile);

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(profile));
  (fetch as FetchMock).mockResponse(JSON.stringify({ ...profile, photoUrl: newAvatarUrl }));

  render(<Router history={history}><Account /></Router>);

  await wait(() => expect(screen.queryByTestId('tabpanel-Account')).toBeInTheDocument());
  
  const IconEditAvatar = await screen.findByTestId('icon-edit-avatar');
  await act(async () => userEvent.click(IconEditAvatar));

  const InputEditAvatar = await screen.findByTestId('input-text-photoUrl');
  await act(async () => userEvent.type(InputEditAvatar, newAvatarUrl));

  const ButtonEditAvatar = await screen.findByTestId('button-default-save');
  await act(async () => userEvent.click(ButtonEditAvatar));

  const Avatar = await screen.findByTestId('avatar');
  await wait(() => expect(Avatar).toHaveProperty('src', newAvatarUrl));
});
