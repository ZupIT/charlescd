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
import { ActionPayload } from 'modules/Settings/Credentials/Sections/MetricAction/types';
import { createAction, deleteActionById, getPluginsByCategory } from '../actions';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('should delete action by id', async () => {
  const id = '123';

  (fetch as FetchMock).mockResponseOnce("null");

  const response = await deleteActionById(id)({});
  const data = await response.json();

  expect(data).toEqual(null);
});

test('should get plugins by category', async () => {
  const category = 'foobar';

  (fetch as FetchMock).mockResponseOnce("[]");

  const response = await getPluginsByCategory(category)({});
  const data = await response.json();

  expect(data).toEqual([]);
});

test('should create action', async () => {
  const payload = { nickname: 'foobar' } as ActionPayload;

  (fetch as FetchMock).mockResponseOnce("{}");

  const response = await createAction(payload)({});
  const data = await response.json();

  expect(data).toEqual({});
});
