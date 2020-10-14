import { FetchMock } from 'jest-fetch-mock/types';
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
import Auth from '..';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
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

test('render Auth default login', async () => {
  render(<Auth />);

  await wait(() => expect(screen.getByTestId('auth')).toBeInTheDocument());
});

test('render Auth IDM login', async () => {
  const originalWindow = { ...window };
  delete window.location;

  Object.assign(window, { CHARLESCD_ENVIRONMENT: { REACT_APP_IDM: '1' } });

  window.location = {
    ...window.location,
    href: '',
    pathname: ''
  };

  render(<Auth />);

  await wait(() => expect(screen.queryByTestId('auth')).not.toBeInTheDocument());

  Object.assign(window, originalWindow);
});
