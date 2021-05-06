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
import Workspaces from '../';
import { saveProfile } from 'core/utils/profile';
import fetch, { FetchMock } from 'jest-fetch-mock';
import { WORKSPACE_STATUS } from '../enums';

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

const setProfile = (profile: { root?: boolean, name?: string, email?: string }) => {
  authUtils.setAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODkzMjg2NDEsImlhdCI6MTU4OTMyNTA0MSwianRpIjoiZWMwYzZmODMtNzJlOC00YjAxLWE1NjctZTk2Mjg3Y2FlYzdkIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzUm9vdCI6dHJ1ZSwibmFtZSI6IkNoYXJsZXMgQWRtaW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJjaGFybGVzQGFkbWluIiwiZ2l2ZW5fbmFtZSI6ImNoYXJsZXNhZG1pbiIsImVtYWlsIjoiY2hhcmxlc0BhZG1pbiJ9.b3x_QR2PunpKpsfHlPV-dPhaAI82llcHGksu2UEWu1g');
  saveProfile({
    id: '1',
    name: profile?.name || 'Charles Admin',
    email: profile?.email || 'charles@admin',
    root: profile?.root || false
  });
}

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
  setProfile({ root: true });

  render(<Workspaces />);
  
  const button = screen.getByText('Create workspace');
  userEvent.click(button);

  await waitFor(() => expect(screen.getByTestId('modal-default')).toBeInTheDocument());
  
  const cancelButton = screen.getByTestId('icon-cancel');
  userEvent.click(cancelButton);
  await waitFor(() => expect(screen.queryByTestId('modal-default')).not.toBeInTheDocument());
});

test('render Workspace and see a placeholder', async () => {
  setProfile({});
  
  render(<Workspaces />);

  expect(await screen.findByTestId('icon-empty-workspaces')).toBeInTheDocument();
  expect(screen.getByText('Hello, Charles Admin!')).toBeInTheDocument();
  expect(screen.getByText('Select or create a workspace in the side menu.')).toBeInTheDocument();
});

test('render Workspace modal and add new workspace', async () => {
  setProfile({ root: true });
  render(<Workspaces />);

  const createWorkspaceButton = screen.getByText('Create workspace');
  userEvent.click(createWorkspaceButton);

  await waitFor(() => expect(screen.getByTestId('modal-default')).toBeInTheDocument());
  
  const inputWorkspace = screen.getByTestId('label-text-name');
  await act(async () => {
    userEvent.type(inputWorkspace , 'workspace');
  });

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();
});

test('render Workspace with search disabled', async () => {
  setProfile({ root: false });

  render(<Workspaces />);

  const search = await screen.findByTestId('input-text-search');
  expect(search).toBeDisabled();
});

test('render Workspace with and search enabled', async () => {
  setProfile({ root: true });

  render(<Workspaces />);

  const search = await screen.findByTestId('input-text-search');
  expect(search).not.toBeDisabled();
});

test('should search a workspace by name', async () => {
  setProfile({ root: true });
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify({
      content: [
        {
          id: '1',
          name: 'ws1',
          status: WORKSPACE_STATUS.COMPLETE
        }
      ]
    }))
    .mockResponseOnce(JSON.stringify({
      content: [
        {
          id: '2',
          name: 'ws2',
          status: WORKSPACE_STATUS.COMPLETE
        }
      ]
    }));

  render(<Workspaces />);

  await waitFor(() => expect(screen.getByText('ws1')).toBeInTheDocument());
  expect(screen.queryByText('ws2')).not.toBeInTheDocument();

  const search = await screen.findByTestId('input-text-search');
  userEvent.type(search , 'ws2');
  await waitFor(() => expect(screen.getByText('ws2')).toBeInTheDocument(), { timeout: 900 });
  expect(screen.queryByText('ws1')).not.toBeInTheDocument();
});
