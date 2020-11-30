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
import { useGlobalState } from 'core/state/hooks';
import { AllTheProviders as wrapper } from 'unit-test/testUtils';
import { Column } from '../interfaces';
import { useBoard } from '../hooks';

jest.mock('core/state/hooks', () => ({
  useDispatch: () => jest.fn(),
  useContext: () => jest.fn(),
  useGlobalState: () => jest.fn()
}));

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('to get a Board', async () => {
  const id = '123';

  const board = [
    {
      id: "123",
      name: "To Do",
    }, {
      id: "456",
      name: "Doing",
    }, {
      id: "789",
      name: "Ready To Go",
    }, {
      id: "012",
      name: "Builds",
    }, {
      id: "345",
      name: "Deployed Releases",
    }
  ];

  (fetch as FetchMock).mockResponse(JSON.stringify(board));

  const { result: userResult } = renderHook(() => useBoard());

  let response: Promise<{ board: Column[] }>;
  await act(async () => {
    response = await userResult.current.getAll(id);
  });
  
  expect(response).toEqual(board);
});
