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
import fetch, { FetchMock } from 'jest-fetch-mock';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import { getWorkspace } from 'core/utils/workspace';

const props = {
  onCreate: jest.fn(),
  selectedWorkspace: jest.fn()
};

test('renders Workspace menu', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify([
      {
        id: '1',
        name: 'ws1',
        status: WORKSPACE_STATUS.COMPLETE
      },
      {
        id: '2',
        name: 'ws2',
        status: WORKSPACE_STATUS.COMPLETE
      }
    ]));
  
  render(<Menu onCreate={props.onCreate} />);

  const workspaces = await screen.findAllByText(/ws/);
  expect(workspaces.length).toBe(2);
});

test('renders Workspace menu without any results', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify([]));

  render(<Menu onCreate={props.onCreate} />);

  await waitFor(() => expect(screen.getByText('No workspace was found')).toBeInTheDocument());
});

test('renders Workspace menu on loading', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify([]));

  render(<Menu onCreate={props.onCreate} />);

  await waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());
});

test('should click Workspace item', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify([
      {
        id: '1',
        name: 'ws1',
        status: WORKSPACE_STATUS.COMPLETE
      },
      {
        id: '2',
        name: 'ws2',
        status: WORKSPACE_STATUS.COMPLETE
      }
    ]));

  render(<Menu onCreate={props.onCreate} />);

  const item = await screen.findByTestId('workspace-ws2');
  userEvent.click(item);

  const workspace = getWorkspace();
  expect(workspace?.name).toEqual('ws2');
});