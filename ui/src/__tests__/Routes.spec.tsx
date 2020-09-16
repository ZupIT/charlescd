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
import { render, wait, waitForElement } from 'unit-test/testUtils';
import { accessTokenKey, refreshTokenKey, setAccessToken } from 'core/utils/auth';
import { getProfileByKey, profileKey } from 'core/utils/profile';
import { FetchMock } from 'jest-fetch-mock/types';
import Routes from '../Routes';

const originalWindow = { ...window };
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXJsZXNjZEB6dXAuY29tLmJyIn0.-FFlThOUdBvFBV36CaUxkzjGujyrF7mViuPhgdURe_k';
const user = {
  id: '1',
  name: 'charlescd',
  email: 'charlescd@zup.com.br',
  workspaces: [{ id: '1', name: 'workspace' }]
}

jest.mock('core/constants/routes', () => {
  return {
    routes: {
      baseName: '/',
      workspaces: '/workspaces',
      error403: '/error/403',
      error404: '/error/404'
    }
  };
});

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

afterEach(() => {
  window = originalWindow;
});

test('render default route', async () => {
  const { container } = render(<Routes />);

  await wait(() => expect(container.innerHTML).toMatch('Error 403.'));
});

test('render and valid login saving the session', async () => {
  delete window.location;

  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  window.location = {
    ...window.location,
    href: '?code=321',
    pathname: '',
  };

  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    access_token: token,
    refresh_token: 'opqrstuvwxyz'
  }));

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(user));

  await waitForElement(() => render(<Routes />));
  
  const accessToken = localStorage.getItem(accessTokenKey);
  expect(accessToken).toContain(token);
  
  const refreshToken = localStorage.getItem(refreshTokenKey);
  expect(refreshToken).toContain('opqrstuvwxyz');

  const email = getProfileByKey('email');
  expect(email).toMatch(user.email);
});

test('render with a valid session', async () => {
  delete window.location;

  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  window.location = {
    ...window.location,
    href: '',
    pathname: '',
  };

  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    id: '1',
    name: 'charlescd',
    email: 'charlescd@zup.com.br',
    workspaces: [{ id: '1', name: 'workspace' }]
  }));

  setAccessToken(token);

  await waitForElement(() => render(<Routes />));
  
  const accessToken = localStorage.getItem(accessTokenKey);
  expect(accessToken).toContain(token);
  
  const email = getProfileByKey('email');
  expect(email).toMatch(user.email);
});

test('render with an invalid session', async () => {
  delete window.location;

  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  setAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2hhcmxlc2NkIn0.YmbNSxCZZldr6pH1l3q_4SImIYeDaIgJazVEhy134T0');

  window.location = {
    ...window.location,
    href: '',
    pathname: '',
  };

  await waitForElement(() => render(<Routes />));
  
  const name = getProfileByKey('name');
  expect(name).toBeUndefined();
});
