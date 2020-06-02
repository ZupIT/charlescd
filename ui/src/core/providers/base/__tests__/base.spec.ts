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
import { baseRequest } from '..';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('base request success', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ name: 'base request' })
  );

  const response = await baseRequest('/test', {}, { method: 'POST' })({});
  const data = await response.json();

  expect(data).toEqual({ name: 'base request' });
});

test('base request reject', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({ name: 'base request' }), {
    status: 401
  });

  baseRequest(
    '/test',
    {},
    { method: 'POST' }
  )({}).catch(async err =>
    expect(await err.json()).toEqual({ name: 'base request' })
  );
});
