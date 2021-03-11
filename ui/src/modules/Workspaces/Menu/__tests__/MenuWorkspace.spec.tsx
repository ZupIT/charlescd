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
import { render, screen, waitFor, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Menu from '../index';
import * as StateHooks from 'core/state/hooks';
import * as authUtils from 'core/utils/auth';
import * as WorkspaceHooks from '../../hooks';

const props = {
  onCreate: jest.fn(),
  selectedWorkspace: jest.fn()
};

test('renders Workspace menu', async () => {
  const workspaceRequest = jest.fn();
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
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

  render(
    <Menu
      onCreate={props.onCreate}
      selectedWorkspace={props.selectedWorkspace}
    />
  );
  
  expect(screen.getByTestId('labeledIcon-plus-circle')).toBeInTheDocument();
  expect(screen.getByText('Create workspace')).toBeInTheDocument();
  expect(screen.getByTestId('input-text-search')).toBeInTheDocument();

  const workspacesArray = screen.getAllByText(/ws/);
  expect(workspacesArray.length).toBe(2);
});

test('renders Workspace menu without any results', async () => {
  const workspaceRequest = jest.fn();
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
  jest.spyOn(WorkspaceHooks, 'useWorkspaces').mockImplementation(() => [workspaceRequest, jest.fn(), false]);
  jest.spyOn(StateHooks, 'useGlobalState')
    .mockReturnValue({
      list: {
        content: []
      }
    })

  render(
    <Menu
      onCreate={props.onCreate}
      selectedWorkspace={props.selectedWorkspace}
    />
  );

  await waitFor(() => expect(screen.getByText('No workspace was found')).toBeInTheDocument());
});

test('renders Workspace menu on loading', async () => {
  const workspaceRequest = jest.fn();
  jest.spyOn(WorkspaceHooks, 'useWorkspaces').mockImplementation(() => [workspaceRequest, jest.fn(), true]);
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

  render(
    <Menu
      onCreate={props.onCreate}
      selectedWorkspace={props.selectedWorkspace}
    />
  );

  await waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());
});

test('should click Workspace item', async () => {
  const selectedWorkspace = jest.fn();
  const workspaceRequest = jest.fn();
  jest.spyOn(authUtils, 'isRoot').mockImplementation(() => true);
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

  render(
    <Menu
      onCreate={props.onCreate}
      selectedWorkspace={selectedWorkspace}
    />
  );

  const item = await screen.findByTestId('workspace-ws1');
  await act(async () => userEvent.click(item));

  await waitFor(() => expect(selectedWorkspace).toHaveBeenCalled());
});