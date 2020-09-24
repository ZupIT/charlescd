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
import { useRouter, getPath, redirectToLegacy } from '../routes';
import { MemoryRouter } from 'react-router-dom';

const mockPush = jest.fn();
const mockGo = jest.fn();
const mockGoBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn().mockImplementation(mockPush),
    goBack: jest.fn().mockImplementation(mockGoBack),
    go: jest.fn().mockImplementation(mockGo),
    replace: jest.fn().mockImplementation(mockReplace)
  })
}));

test('useRouter functions have been called with params', () => {
  const { result } = renderHook(() => useRouter(), { wrapper: MemoryRouter });
  const router = result.current;

  router.push('/help');
  router.goBack();
  router.go(1);
  router.replace('/help');

  expect(mockPush).toHaveBeenCalledWith('/help');
  expect(mockGoBack).toHaveBeenCalled();
  expect(mockGo).toHaveBeenCalledWith(1);
  expect(mockReplace).toHaveBeenCalledWith('/help');
});

test('get path by url and valid param', () => {
  expect(getPath('/:name1/:name2', ['test1', 'test2'])).toEqual('/test1/test2');
});

test('get path by url and invalid params length', () => {
  expect(getPath('/:name1/:name2', ['test'])).toEqual('/:name1/:name2');
});

test('redirect to legacy', () => {
  const originalWindow = { ...window };
  delete window.location;

  process.env = Object.assign(process.env, { NODE_ENV: 'production' });

  window.location = {
    ...window.location,
    href: '',
    pathname: ''
  };

  redirectToLegacy('/test');

  expect(window.location.href).toEqual('/test');

  Object.assign(process.env, { NODE_ENV: 'test' });
  Object.assign(window, originalWindow);
});
