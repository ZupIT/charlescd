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
import { render, screen, act, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock';
import * as authUtils from 'core/utils/auth';
import * as WorkspaceHooks from '../hooks';
import Workspaces from '..';

const originalWindow = { ...window };

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

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
  
  render(<Workspaces selectedWorkspace={jest.fn()} />);
  
  const button = screen.getByText('Create workspace');
  await act(async () => {
    userEvent.click(button);
  })

  const modalTitle = screen.getAllByText('Create workspace')[0];
  expect(modalTitle).toBeInTheDocument();

  const modalInput = screen.getByText('Type a name');
  expect(modalInput).toBeInTheDocument();
  
  const modalButton = screen.getAllByText('Create workspace')[1];
  expect(modalButton).toBeInTheDocument();
  
  const cancelButton = screen.getByTestId('icon-cancel');
  userEvent.click(cancelButton);
  await waitFor(() => expect(screen.queryByTestId('modal-default')).not.toBeInTheDocument());
});

test('render Workspace and show a placeholder', async () => {
  const user = {
    name: 'charles admin',
    email: 'charlesadmin@admin'
  }
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  jest.spyOn(authUtils, 'getAccessTokenDecoded').mockReturnValue(user);
  render(<Workspaces selectedWorkspace={jest.fn()} />);

  expect(await screen.findByTestId('placeholder-empty-workspaces')).toBeInTheDocument();
  expect(screen.getByText('Hello, charles admin!')).toBeInTheDocument();
  expect(screen.getByText('Select or create a workspace in the side menu.')).toBeInTheDocument();
});

test('render Workspace modal and add new workspace', async () => {
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);

  render(<Workspaces selectedWorkspace={jest.fn()} />);

  const button = screen.getByText('Create workspace');
  userEvent.click(button);

  await waitFor(() => expect(screen.getByTestId('modal-default')).toBeInTheDocument());
  
  const inputWorkspace = screen.getByTestId('label-text-name');
  userEvent.type(inputWorkspace , 'workspace');
  expect(screen.getByTestId('modal-default')).toBeInTheDocument();
});

test('render Workspace with isIDMAuthFlow disabled and search', async () => {
  const workspaceRequest = jest.fn()

  jest.spyOn(authUtils, 'isIDMAuthFlow').mockImplementation(() => false);
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  const useWorkspaceSpy = jest.spyOn(WorkspaceHooks, 'useWorkspace')
    .mockImplementation(() => [workspaceRequest, jest.fn(), false]);
  
  useWorkspaceSpy.mockRestore();
  render(<Workspaces selectedWorkspace={jest.fn()} />);

  const search = screen.getByTestId('input-text-search');

  userEvent.type(search , 'workspace');

  await waitFor(() => expect(workspaceRequest).toHaveBeenCalledTimes(0));
});

test.only('render Workspace with isIDMAuthFlow enabled and search', async () => {
  const workspaceRequest = jest.fn();

  jest.spyOn(authUtils, 'isIDMAuthFlow').mockImplementation(() => true);
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  jest.spyOn(WorkspaceHooks, 'useWorkspace').mockImplementation(() => [workspaceRequest, jest.fn(), false]);
  
  render(<Workspaces selectedWorkspace={jest.fn()} />);

  const search = screen.getByTestId('input-text-search');

  userEvent.type(search , 'workspace');

  await waitFor(() => expect(workspaceRequest).toHaveBeenCalled());
});

// TODO teste q garante q ao digitar nome de workspace no search input, mostre os filtrados
