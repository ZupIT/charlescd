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

import React from 'react';
import { render, screen, fireEvent, wait, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import * as authUtils from 'core/utils/auth';
import * as WorkspaceHooks from '../hooks';
import * as StateHooks from 'core/state/hooks';
import { FetchMock } from 'jest-fetch-mock/types';
import MutationObserver from 'mutation-observer';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import { workspaceResponce } from './fixtures';
import Workspace from '../';

(global as any).MutationObserver = MutationObserver;

const originalWindow = { ...window };

beforeAll(() => {
  delete window.location;

  window.location = {
    ...window.location,
    href: '',
    pathname: '',
    hostname: 'charles.hostname'
  };
});

afterAll(() => {
  Object.assign(window, originalWindow);
});

jest.mock('react-cookies', () => {
  return {
    __esModule: true,
    load: () => {
      return '';
    },
    remove:  (key: string, options: object) => {
      return `mock remove ${key}`;
    }
  };
});

test('render Workspace modal', async () => {
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  render(<Workspace selectedWorkspace={jest.fn()} />);
  const button = screen.getByTestId('button-default-workspaceModal');
  fireEvent.click(button);

  await wait(() => expect(screen.queryByTestId('modal-default')).toBeInTheDocument());
  
  const cancelButton = screen.getByTestId('icon-cancel');
  fireEvent.click(cancelButton);
  await wait(() => expect(screen.queryByTestId('modal-default')).not.toBeInTheDocument());
});

test('render Workspace and see a placeholder', async () => {
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  
  render(<Workspace selectedWorkspace={jest.fn()} />);

  const placeholder = screen.queryByTestId('placeholder-empty-workspaces');

  expect(placeholder).toBeInTheDocument();
});

test('render Workspace and search', async () => {
  const workspaceRequest = jest.fn();

  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  jest.spyOn(WorkspaceHooks, 'useWorkspace').mockImplementation(() => [workspaceRequest, jest.fn(), false]);
  
  render(<Workspace selectedWorkspace={jest.fn()} />);

  const search = screen.getByTestId('input-text-search');

  await act(() => userEvent.type(search , 'workspace'));

  expect(workspaceRequest).toHaveBeenCalled();
});
