/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import { render, screen, waitFor } from 'unit-test/testUtils';
import { accessTokenKey, clearSession, refreshTokenKey, setAccessToken } from 'core/utils/auth';
import { getProfileByKey, profileKey } from 'core/utils/profile';
import { FetchMock } from 'jest-fetch-mock';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Routes from '../Routes';

const originalWindow = window;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXJsZXNjZEB6dXAuY29tLmJyIn0.-FFlThOUdBvFBV36CaUxkzjGujyrF7mViuPhgdURe_k';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2hhcmxlc2NkIn0.YmbNSxCZZldr6pH1l3q_4SImIYeDaIgJazVEhy134T0';
const user = {
  id: '1',
  name: 'charlescd',
  email: 'charlescd@zup.com.br',
  workspaces: [{ id: '1', name: 'workspace' }]
}

jest.mock('react-cookies', () => {
  return {
    __esModule: true,
    save: () => {
      return '';
    },
    load: () => {
      return '';
    },
    remove: (key: string, options: object) => {
      return `mock remove ${key}`;
    }
  };
});

beforeEach(() => {
  Object.assign(window, originalWindow);
  const location = window.location
  delete global.window.location
  global.window.location = Object.assign({}, location)

  clearSession();
})

test('render default route', async () => {
  render(<MemoryRouter><Routes /></MemoryRouter>);

  await waitFor(() => expect(screen.queryByTestId('sidebar')).toBeInTheDocument());
});

test('render with a valid session token', async () => {
  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  setAccessToken(token);

  (fetch as FetchMock).mockResponse(JSON.stringify({
    id: '1',
    name: 'charlescd',
    email: 'charlescd@zup.com.br',
    workspaces: [{ id: '1', name: 'workspace' }]
  }));

  render(
    <BrowserRouter basename="/">
      <Routes />
    </BrowserRouter>
  );

  await waitFor(async () => expect(screen.getByTestId('sidebar')).toBeInTheDocument());

  const accessToken = localStorage.getItem(accessTokenKey);
  expect(accessToken).toContain(token);

  const email = getProfileByKey('email');
  expect(email).toMatch(user.email);
});

test('render with an invalid session token', async () => {
  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  setAccessToken(invalidToken);

  render(<MemoryRouter><Routes /></MemoryRouter>);

  const name = getProfileByKey('name');
  expect(name).toBeUndefined();
});

test('render and valid login saving the session', async () => {
  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  window.location = {
    ...window.location,
    href: '?code=321',
    pathname: '/charlescd/workspaces',
  };

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      'access_token': token,
      'refresh_token': 'opqrstuvwxyz'
    }))
    .mockResponseOnce(JSON.stringify({}))
    .mockResponseOnce(JSON.stringify({
      id: '1',
      name: 'charlescd',
      email: 'charlescd@zup.com.br',
      workspaces: [{ id: '1', name: 'workspace' }]
    }));

  render(<MemoryRouter><Routes /></MemoryRouter>);

  const iconError403 = await screen.findByTestId('icon-error-403');
  expect(iconError403).toBeInTheDocument();

  const accessToken = localStorage.getItem(accessTokenKey);
  expect(accessToken).toContain(token);

  const refreshToken = localStorage.getItem(refreshTokenKey);
  expect(refreshToken).toContain('opqrstuvwxyz');

  const email = getProfileByKey('email');
  expect(email).toMatch(user.email);
});

test('create user in charles base', async () => {
  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  window.location = {
    ...window.location,
    href: '?code=321',
    pathname: '/charlescd/workspaces',
  };

  const profile = {
    id: '1',
    name: 'charlescd',
    email: 'charlescd@zup.com.br',
    workspaces: [{}],
  };

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      'access_token': token,
      'refresh_token': 'opqrstuvwxyz'
    }))
    .mockRejectedValueOnce({ status: 404, json: () => ({ message: 'Error' }) })
    .mockResponse(JSON.stringify(profile));

  render(<MemoryRouter><Routes /></MemoryRouter>);

  const iconError403 = await screen.findByTestId('icon-error-403');
  expect(iconError403).toBeInTheDocument();

  const profileBase64 = btoa(JSON.stringify(profile));
  await waitFor(() => expect(localStorage.getItem(profileKey)).toEqual(profileBase64));
});