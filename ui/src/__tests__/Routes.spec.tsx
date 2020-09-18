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
import { render, wait, screen } from 'unit-test/testUtils';
import { accessTokenKey, clearSession, refreshTokenKey, setAccessToken } from 'core/utils/auth';
import { getProfileByKey, profileKey } from 'core/utils/profile';
import { FetchMock } from 'jest-fetch-mock';
import { MemoryRouter } from 'react-router-dom';
import { setIsMicrofrontend } from 'App';
import Routes from '../Routes';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXJsZXNjZEB6dXAuY29tLmJyIn0.-FFlThOUdBvFBV36CaUxkzjGujyrF7mViuPhgdURe_k';
const user = {
  id: '1',
  name: 'charlescd',
  email: 'charlescd@zup.com.br',
  workspaces: [{ id: '1', name: 'workspace' }]
}

jest.mock('react-cookies', () => {
  return {
    __esModule: true,
    load: () => {
      return '';
    },
    remove:  (key: string, options: object) => {
      return `mock remove ${key}`;
    }
  };
});

beforeEach(() => {
  clearSession();
})

test('render default route', async () => {
  render(<MemoryRouter><Routes /></MemoryRouter>);
  await wait(() => expect(screen.queryByTestId('sidebar')).toBeInTheDocument());
});

test('render with a valid session', async () => {
  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  setAccessToken(token);

  (fetch as FetchMock).mockResponse(JSON.stringify({
    id: '1',
    name: 'charlescd',
    email: 'charlescd@zup.com.br',
    workspaces: [{ id: '1', name: 'workspace' }]
  }));

  render(<MemoryRouter><Routes /></MemoryRouter>);
  await wait(() => expect(screen.queryByTestId('sidebar')).toBeInTheDocument());
  
  const accessToken = localStorage.getItem(accessTokenKey);
  expect(accessToken).toContain(token);

  const email = getProfileByKey('email');
  expect(email).toMatch(user.email);
});

test('render with an invalid session', async () => {
  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  setAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2hhcmxlc2NkIn0.YmbNSxCZZldr6pH1l3q_4SImIYeDaIgJazVEhy134T0');

  render(<MemoryRouter><Routes /></MemoryRouter>);
  await wait(() => expect(screen.queryByTestId('sidebar')).toBeInTheDocument());

  const name = getProfileByKey('name');
  expect(name).toBeUndefined();
});


test('render main in microfrontend mode', async () => {
  setIsMicrofrontend(true);

  const { getByTestId } = render(<MemoryRouter><Routes /></MemoryRouter>);
  await wait(() => expect(
    getByTestId('menu-workspaces').getAttribute('href')).toContain('/charlescd')
  );
});

test('render and valid login saving the session', async () => {
  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  delete window.location;
  window.location = {
    ...window.location,
    href: '?code=321',
    pathname: '/workspaces',
  };

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXJsZXNjZEB6dXAuY29tLmJyIn0.-FFlThOUdBvFBV36CaUxkzjGujyrF7mViuPhgdURe_k',
      'refresh_token': 'opqrstuvwxyz'
    }))
    .mockResponseOnce(JSON.stringify({
      id: '1',
      name: 'charlescd',
      email: 'charlescd@zup.com.br',
      workspaces: [{ id: '1', name: 'workspace' }]
    }));

  render(<MemoryRouter><Routes /></MemoryRouter>);
  await wait(() => expect(screen.queryByTestId('icon-error-403')).toBeInTheDocument());
  
  const accessToken = localStorage.getItem(accessTokenKey);
  expect(accessToken).toContain(token);
  
  const refreshToken = localStorage.getItem(refreshTokenKey);
  expect(refreshToken).toContain('opqrstuvwxyz');

  const email = getProfileByKey('email');
  expect(email).toMatch(user.email);
});

test('create user in charles base', async () => {
  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  delete window.location;
  window.location = {
    ...window.location,
    href: '?code=321',
    pathname: '/workspaces',
  };

  const profile = {
    id: '1',
    name: 'charlescd',
    email: 'charlescd@zup.com.br',
    workspaces: [{}],
  };

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXJsZXNjZEB6dXAuY29tLmJyIiwibmFtZSI6ImNoYXJsZXMifQ.ejWaLlL7rbM3nDCyhXOERSwh-aCftvnw4Ag0oDYWQjM',
      'refresh_token': 'opqrstuvwxyz'
    }))
    .mockRejectedValueOnce({ status: 404, json: () => ({ message: 'Error' })})
    .mockResponse(JSON.stringify(profile));

  render(<MemoryRouter><Routes /></MemoryRouter>);
  await wait(() => expect(screen.queryByTestId('icon-error-403')).toBeInTheDocument());

  const profileBase64 = btoa(JSON.stringify(profile));
  await wait(() => expect(localStorage.getItem(profileKey)).toEqual(profileBase64));
});