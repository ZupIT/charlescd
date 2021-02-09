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
import { screen, wait } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import { useCreateUserGroup, useDeleteUserGroup, useFindAllUserGroup, useFindUserGroupByID, useListUser, useManagerMemberInUserGroup, useUpdateUserGroup } from '../hooks';
import { UserGroup } from '../interfaces/UserGroups';
import {userGroupPagination, userGroup, users} from './fixtures';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

const newUserGroup = {
  name: 'user-group',
};

jest.mock('core/state/hooks', () => ({
  useDispatch: () => jest.fn()
}));

test('create a new user group', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(newUserGroup));

  const { result } = renderHook(() => useCreateUserGroup());

  await act(async () => {
    await result.current.createUserGroup(newUserGroup.name);
  });

  await wait(() => expect(result.current.response).toMatchObject(newUserGroup));
});

test('error create a new user group', async () => {
  const error = {
    name: 'name',
    message: 'The user group has already been register.'
  };

  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify(error)));

  const { result } = renderHook(() => useCreateUserGroup());

  let response: UserGroup;

  await act(async () => {
    response = await result.current.createUserGroup(newUserGroup.name);
  });

  await wait(() => expect(response).toBeUndefined());
  await wait(() => expect(result.current.response).toBeUndefined());
});

test('to find all user groups', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(userGroupPagination));

  const { result } = renderHook(() => useFindAllUserGroup());

  await act(async () => {
    await result.current[0]('group 1');
  });

  await wait(() => expect(result.current[2]).toMatchObject(userGroupPagination));
});

test('to find user group by id', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(userGroup));

  const { result } = renderHook(() => useFindUserGroupByID());

  await act(async () => {
    await result.current[0]('123');
  });

  await wait(() => expect(result.current[1]).toMatchObject(userGroup));
});

test('to list users', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(users));

  const { result } = renderHook(() => useListUser());

  await act(async () => {
    await result.current[0]('charlescd@zup.com.br');
  });

  await wait(() => expect(result.current[1]).toMatchObject(users));
});

test('to update user group', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(userGroup));

  const { result } = renderHook(() => useUpdateUserGroup());

  await act(async () => {
    await result.current[0]('123', 'Charles');
  });

  await wait(() => expect(result.current[1]).toMatchObject(userGroup));
});

test('to delete user group', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));

  const { result } = renderHook(() => useDeleteUserGroup());

  await act(async () => {
    await result.current[0]('123');
  });

  await wait(() => expect(result.current[1]).toMatchObject({}));
});

test('to manager members in user group', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));

  const { result } = renderHook(() => useManagerMemberInUserGroup());

  await act(async () => {
    await result.current[0](false, '123', '456');
  });

  await wait(() => expect(result.current[1]).toBe('resolved'));
});