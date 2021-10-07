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
// @ts-nocheck


import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import WorkspaceItem from '../MenuItem';
import { getWorkspace } from 'core/utils/workspace';

test('render Workspace item', async () => {
  render(
    <WorkspaceItem  
      workspace={{
        id: '1',
        name: 'ws1',
        createdAt: '',
        permissions: []
      }}
    />
  );

  const workspace = await screen.findByText('ws1');
  expect(workspace).toBeInTheDocument();
});

test('render Workspace item and click', async () => {
  render(
    <WorkspaceItem  
      workspace={{
        id: '1',
        name: 'ws1',
        createdAt: '',
        permissions: []
      }}
    />
  );

  const ws1 = await screen.findByText('ws1');
  userEvent.click(ws1);

  const workspace = getWorkspace();
  expect(workspace.name).toEqual('ws1');
});
