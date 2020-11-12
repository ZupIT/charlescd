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
import { FetchMock } from 'jest-fetch-mock';
import { useActionData, useCreateAction, useDeleteAction, usePlugins } from '../hooks';
import { Action, ActionPayload } from '../types';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

jest.mock('core/state/hooks', () => ({
  useDispatch: () => jest.fn()
}));

test('get action data', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));

  const { result } = renderHook(() => useActionData());
  const { current } = result;

  let response: Action[];

  await act(async () => {
    response = await current.getActionData();
  });

  expect(response).toMatchObject({});
});

test('error get action data', async () => {
  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify({})));

  const { result: userResult } = renderHook(() => useActionData());

  let response: Action[];
  await act(async () => {
    response = await userResult.current.getActionData();
  });

  expect(response).toBeUndefined();
});

test('should delete action', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));

  const { result } = renderHook(() => useDeleteAction());
  const { current } = result;

  let response: Action;

  await act(async () => {
    response = await current.deleteAction('123');
  });

  expect(response).toMatchObject({});
});

test('error delete action', async () => {
  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify({})));

  const { result: userResult } = renderHook(() => useDeleteAction());

  let response: Action;
  await act(async () => {
    response = await userResult.current.deleteAction('123');
  });

  expect(response).toBeUndefined();
});

test('get plugins', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));

  const { result } = renderHook(() => usePlugins());
  const { current } = result;

  let response: any;

  await act(async () => {
    response = await current.getPlugins('foobar');
  });

  expect(response).toMatchObject({});
});

test('error get plugin', async () => {
  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify({})));

  const { result: userResult } = renderHook(() => usePlugins());

  let response: any;
  await act(async () => {
    response = await userResult.current.getPlugins('foobar');
  });

  expect(response).toBeUndefined();
});

test('should create action', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  const payload = { nickname: 'foobar' } as ActionPayload;
  const { result } = renderHook(() => useCreateAction());
  const { current } = result;

  let response: ActionPayload;

  await act(async () => {
    response = await current.createAction(payload);
  });

  expect(response).toMatchObject({});
});

test('error create action', async () => {
  (fetch as FetchMock).mockRejectedValue(new Response(JSON.stringify({})));
  const payload = { nickname: 'foobar' } as ActionPayload;
  const { result: userResult } = renderHook(() => useCreateAction());

  let response: ActionPayload;
  await act(async () => {
    response = await userResult.current.createAction(payload);
  });

  expect(response).toBeUndefined();
});