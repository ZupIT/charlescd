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

import { FetchMock } from 'jest-fetch-mock';
import { login, renewToken } from '../auth';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('login provider request', async () => {
  const username = 'user';
  const password = 'password';

  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'login' }));

  const response = await login(username, password)({});
  const data = await response.json();

  expect(data).toEqual({ name: 'login' });
});

test('renew token provider request', async () => {
  const refreshToken = 'refreshToken';

  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ name: 'renew-token' })
  );

  const response = await renewToken(refreshToken)({});
  const data = await response.json();

  expect(data).toEqual({ name: 'renew-token' });
});
