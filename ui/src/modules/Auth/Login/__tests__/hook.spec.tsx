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
import { circleKey } from 'core/utils/circle';
import { accessTokenKey, refreshTokenKey } from 'core/utils/auth';
import { useCircleMatcher, useLogin } from '../hook';
import { CIRCLE_UNMATCHED } from '../constants';

jest.mock('core/state/hooks', () => ({
  useDispatch: () => jest.fn()
}));

test('match a circle id', async () => {
  const id = '123';
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    circles: [{ id, name: 'circle' }]
  }));
  const { result } = renderHook(() => useCircleMatcher());
  const { current } = result;

  await act(async () => current.getCircleId({ username: 'charlescd@zup.com.br' }));

  expect(document.cookie).toContain(`${circleKey}=${id}`);
});

test('should not match a circle id', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  const { result } = renderHook(() => useCircleMatcher());
  const { current } = result;

  await act(async () => current.getCircleId({ username: 'charlescd@zup.com.br' }));

  expect(document.cookie).toContain(`${circleKey}=${CIRCLE_UNMATCHED}`);
});

test('do login', async () => {
  const id = '123';
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    access_token: 'abcdefghijklmn', refresh_token: 'opqrstuvwxyz'
  }));
  
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    circles: [{ id, name: 'circle' }]
  }));
  
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({
    id: '1',
    name: 'charlescd',
    email: 'charlescd@zup.com.br',
    workspaces: [{ id: '1', name: 'workspace' }]
  }));

  const { result } = renderHook(() => useLogin());
  const { current } = result;

  await act(async () => current.doLogin({ email: 'charlescd@zup.com.br', password: '1235' }));

  expect(document.cookie).toContain(`${circleKey}=${id}`);
  
  const accessToken = localStorage.getItem(accessTokenKey);
  expect(accessToken).toContain('abcdefghijklmn');
  
  const refreshToken = localStorage.getItem(refreshTokenKey);
  expect(refreshToken).toContain('opqrstuvwxyz');
});