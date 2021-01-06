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

import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import { useCreateUser, useUpdateName, useUser } from '../hooks';
import { NewUser, User } from '../interfaces/User';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

jest.mock('core/state/hooks', () => ({
  useDispatch: () => jest.fn()
}));

const payload = {
  id: '123',
  name: 'Charles',
  email: 'charlescd@zup.com.br'
};

const newUser = {
  ...payload
};

const userData = {
  ...payload,
  "photoUrl": "", 
  "createdAt": "12/12/2020"
}

const workspacesData = [
  {
      id: "123",
      name: "Charles",
      permissions: [
          "deploy_write",
          "modules_read",
          "hypothesis_write",
          "hypothesis_read",
          "modules_write",
          "circles_read",
          "circles_write",
          "maintenance_write"
      ]
  }
]

const profileData = {
  ...userData,
  workspaces: workspacesData
}

test('create a new user', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(newUser));

  const { result } = renderHook(() => useCreateUser());
  const { current } = result;

  let response: Promise<NewUser>;

  await act(async () => {
    response = await current.create(payload);
  });

  await waitFor(() => expect(response).toMatchObject(newUser));
});

test('error create a new user', async () => {
  const error = {
    name: 'name',
    message: 'The email charles@zup.com.br has already been register.'
  };

  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify(error)));

  const { result: userResult } = renderHook(() => useCreateUser());

  let response: Promise<NewUser>;
  await act(async () => {
    response = await userResult.current.create(payload);
  });

  await waitFor(() => expect(response).toBeUndefined());
});


test('useUpdateName hook trigger promise success', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(newUser));
  const { result } = renderHook(() => useUpdateName());

  await act(async () => result.current.updateNameById(newUser.id, newUser.name));

  expect(result.current.status).toEqual('resolved');
});

test('useUpdateName hook trigger promise error', async () => {
  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify({})));

  const { result } = renderHook(() => useUpdateName());

  await act(async () => result.current.updateNameById(newUser.id, newUser.name));

  expect(result.current.status).toEqual('rejected');
});

test('should get data about user and their workspaces, which is saved in profile (local storage)', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(userData));
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(workspacesData));

  const { result } = renderHook(() => useUser());
  const { current } = result;

  let response: Promise<User>;

  await act(async () => {
    response = await current.findByEmail(newUser.email);
  });

  expect(response).toMatchObject(profileData);
  expect(response).not.toBeUndefined();
});

test('should throw an error', async () => {
  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify({})));

  const { result } = renderHook(() => useUser());
  const { current } = result;

  let response: Promise<User>;

  await act(async () => {
    response = await current.findByEmail(newUser.email);
  });

  expect(response).toBeUndefined();
});