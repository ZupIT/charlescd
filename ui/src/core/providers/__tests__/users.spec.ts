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
import { createNewUser, patchProfileById, changePassword } from '../users';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('create new user provider request', async () => {
  const user = {
    name: 'name',
    email: 'charles@zup.com.br',
    password: '123457'
  };

  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ message: 'new user created' })
  );

  const response = await createNewUser(user)({});
  const data = await response.json();

  expect(data).toEqual({ message: 'new user created' });
});

test('update a user provider request', async () => {
  const id = '123';
  const name = 'Charles';

  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ message: 'user updated' })
  );

  const response = await patchProfileById(id, name)({});
  const data = await response.json();

  expect(data).toEqual({ message: 'user updated' });
});

test('update a user password provider request', async () => {
  const passwords = {
    oldPassword: '123',
    newPassword: '456',
    confirmPassword: '456'
  };

  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ message: 'password updated' })
  );

  const response = await changePassword(passwords)({});
  const data = await response.json();

  expect(data).toEqual({ message: 'password updated' });
});