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
import * as authUtils from 'core/utils/auth';
import * as WorkspaceHooks from '../hooks';
import {user} from './fixtures';
import * as StateHooks from 'core/state/hooks';
import Workspaces from '../';

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
  
  render(<Workspaces selectedWorkspace={jest.fn()} />);
  
  const button = screen.getByText('Create workspace');
  userEvent.click(button);

  await waitFor(() => expect(screen.getByTestId('modal-default')).toBeInTheDocument());
  
  const cancelButton = screen.getByTestId('icon-cancel');
  userEvent.click(cancelButton);
  await waitFor(() => expect(screen.queryByTestId('modal-default')).not.toBeInTheDocument());
});

test('render Workspace and see a placeholder', async () => {
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  jest.spyOn(authUtils, 'getAccessTokenDecoded').mockReturnValue(user);
  
  render(<Workspaces selectedWorkspace={jest.fn()} />);

  expect(await screen.findByTestId('placeholder-empty-workspaces')).toBeInTheDocument();
  expect(screen.getByText('Hello, Charles Admin!')).toBeInTheDocument();
  expect(screen.getByText('Select or create a workspace in the side menu.')).toBeInTheDocument();
});

test('render Workspace modal and add new workspace', async () => {
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  jest.spyOn(authUtils, 'getAccessTokenDecoded').mockReturnValue(user);

  render(<Workspaces selectedWorkspace={jest.fn()} />);

  const createWorkspaceButton = screen.getByText('Create workspace');
  userEvent.click(createWorkspaceButton);

  await waitFor(() => expect(screen.getByTestId('modal-default')).toBeInTheDocument());
  
  const inputWorkspace = screen.getByTestId('label-text-name');
  await act(async () => {
    userEvent.type(inputWorkspace , 'workspace');
  });

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();
});

test('render Workspace with isIDMEnabled disabled and search', async () => {
  const workspaceRequest = jest.fn();

  jest.spyOn(authUtils, 'isIDMEnabled').mockImplementation(() => false);
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  jest.spyOn(authUtils, 'getAccessTokenDecoded').mockReturnValue(user);
  const useWorkspaceSpy = jest.spyOn(WorkspaceHooks, 'useWorkspaces')
    .mockImplementation(() => [workspaceRequest, jest.fn(), false]);
  
  useWorkspaceSpy.mockRestore();

  render(<Workspaces selectedWorkspace={jest.fn()} />);

  const search = screen.getByTestId('input-text-search');

  await act(async () => userEvent.type(search , 'workspace'));

  await waitFor(() => expect(workspaceRequest).not.toHaveBeenCalled());
});

test('render Workspace with isIDMEnabled enabled and search', async () => {
  const workspaceRequest = jest.fn();

  jest.spyOn(authUtils, 'isIDMEnabled').mockImplementation(() => true);
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  jest.spyOn(authUtils, 'getAccessTokenDecoded').mockReturnValue(user);
  jest.spyOn(WorkspaceHooks, 'useWorkspaces').mockImplementation(() => [workspaceRequest, jest.fn(), false]);

  render(<Workspaces selectedWorkspace={jest.fn()} />);

  const search = await screen.findByTestId('input-text-search');
  await act(async () => userEvent.type(search , 'ws2'));

  await waitFor(() => expect(workspaceRequest).toHaveBeenCalled());
});

test('should search a workspace by name', async () => {
  const workspaceRequest = jest.fn();

  jest.spyOn(authUtils, 'isIDMEnabled').mockImplementation(() => true);
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  jest.spyOn(authUtils, 'getAccessTokenDecoded').mockReturnValue(user);
  jest.spyOn(WorkspaceHooks, 'useWorkspaces').mockImplementation(() => [workspaceRequest, jest.fn(), false]);

  jest.spyOn(StateHooks, 'useGlobalState')
    .mockReturnValue({
      list: {
        content: [
          {
            id: 1,
            name: 'ws1'
          },
          {
            id: 2,
            name: 'ws2'
          }
        ]
      }
    })

  render(<Workspaces selectedWorkspace={jest.fn()} />);

  await waitFor(() => expect(screen.getByText('ws1')).toBeInTheDocument());
  expect(screen.getByText('ws2')).toBeInTheDocument();

  const search = screen.getByTestId('input-text-search');
  await act(async () => userEvent.type(search , 'ws2'));
  expect(workspaceRequest).toHaveBeenCalled();
});
