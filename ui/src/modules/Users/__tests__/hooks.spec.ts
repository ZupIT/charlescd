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
import { useCreateUser, useUpdateName, useUser, useWorkspacesByUser, useUsers } from '../hooks';
import { NewUser, User } from '../interfaces/User';
import {userPagination} from './fixtures';

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

const user = {
  ...payload,
  "photoUrl": "", 
  "createdAt": "12/12/2020",
  "root": true
}

const workspaces = [
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

test('should get data about a user (which is saved in profile of local storage)', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(user));

  const { result } = renderHook(() => useUser());
  const { current } = result;

  let response: Promise<User>;

  await act(async () => {
    response = await current.findByEmail(user.email);
  });

  expect(response).toMatchObject(user);
});

test('should throw an error in useUser', async () => {
  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify({})));

  const { result } = renderHook(() => useUser());
  const { current } = result;

  let response: Promise<User>;

  await act(async () => {
    response = await current.findByEmail(user.email);
  });

  expect(response).toBeUndefined();
});

test('should get workspaces of a user (which is saved in profile of local storage)', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(workspaces));

  const { result } = renderHook(() => useWorkspacesByUser());
  const { current } = result;

  let response: Promise<User>;

  await act(async () => {
    response = await current.findWorkspacesByUser(user.id);
  });

  expect(response).toMatchObject(workspaces);
});

test('should throw an error in userWorkspacesByUser', async () => {
  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify({})));

  const { result } = renderHook(() => useWorkspacesByUser());
  const { current } = result;

  let response: Promise<User>;

  await act(async () => {
    response = await current.findWorkspacesByUser(user.id);
  });

  expect(response).toBeUndefined();
});

// TODO hooks.spec.tsx to .ts
// TODO no test usergroup, colocar data em fixture file
test('should find all users', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify(userPagination));

  const { result } = renderHook(() => useUsers());

  const name = '';
  const page = 0;

  await act(async () => {
    await result.current[0](name, page);
  });

  await waitFor(() => expect(result.current[1]).toMatchObject(userPagination));
});

test('should get an error when finding all users', async () => {
  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify({})));

  const { result } = renderHook(() => useUsers());

  const name = '';
  const page = 0;

  await act(async () => {
    await result.current[0](name, page);
  });

  await waitFor(() => expect(result.current[1]).toBeUndefined());
});