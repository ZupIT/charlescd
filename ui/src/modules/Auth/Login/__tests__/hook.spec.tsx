/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import { circleKey } from 'core/utils/circle';
import { accessTokenKey, refreshTokenKey } from 'core/utils/auth';
import { rest, server } from 'mocks/server';
import { useCircleMatcher, useLogin } from '../hook';
import { removeCookie } from 'unit-test/cookie';
import { DEFAULT_TEST_BASE_URL } from 'setupTests';
import 'unit-test/setup-msw';

jest.mock('core/state/hooks', () => ({
  useDispatch: () => jest.fn()
}));

test('match a circle id', async () => {
  const id = '123';

  const { result } = renderHook(() => useCircleMatcher());
  const { current } = result;

  await act(async () => current.getCircleId({ username: 'charlescd@zup.com.br' }));

  document.cookie = `${circleKey}=${id}`;

  expect(document.cookie).toContain(`${circleKey}=${id}`);
  removeCookie(circleKey);
});

test('should not match a circle id', async () => {
  server.use(
    rest.post(`${DEFAULT_TEST_BASE_URL}/charlescd-circle-matcher/identify`, async (req, res, ctx) => {
      return res(ctx.json({}))
    }),
  );

  const { result } = renderHook(() => useCircleMatcher());
  const { current } = result;

  await act(async () => current.getCircleId({ username: 'charlescd@zup.com.br' }));

  expect(document.cookie).toEqual('');
});

test('do login', async () => {
  const id = '123';

  const { result } = renderHook(() => useLogin());
  const { current } = result;

  await act(async () => current.doLogin({ email: 'charlescd@zup.com.br', password: '1235' }));

  document.cookie = `${circleKey}=${id}`;

  expect(document.cookie).toContain(`${circleKey}=${id}`);

  const accessToken = localStorage.getItem(accessTokenKey);

  expect(accessToken).toBeDefined();

  const refreshToken = localStorage.getItem(refreshTokenKey);
  expect(refreshToken).toBeDefined();
});
