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

import { renderHook } from '@testing-library/react-hooks';
import { useGlobalState, useDispatch } from '../hooks';
import { AllTheProviders as wrapper } from 'unit-test/testUtils';
import { circlesInitialState } from 'modules/Circles/state/reducer';
import { userInitialState } from 'modules/Users/state/reducer';

test('circle: useGlobalState', () => {
  const { result } = renderHook(() => useGlobalState(state => state.circles), {
    wrapper
  });

  expect(result.current).toEqual(circlesInitialState);
});

test('circle: useDispatch', () => {
  const { result } = renderHook(() => useDispatch(), { wrapper });

  expect(result.current).toEqual(expect.any(Function));
});

test('users: useGlobalState', () => {
  const { result } = renderHook(() => useGlobalState(state => state.users), {
    wrapper
  });

  expect(result.current).toEqual(userInitialState);
});

test('users: useDispatch', () => {
  const { result } = renderHook(() => useDispatch(), { wrapper });

  expect(result.current).toEqual(expect.any(Function));
});
