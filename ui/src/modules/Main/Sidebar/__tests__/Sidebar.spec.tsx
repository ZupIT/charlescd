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
import { render, screen, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import routes from 'core/constants/routes';
import { genMenuId } from 'core/utils/menu';
import Sidebar from '../index';
import * as utilsAuth from 'core/utils/auth';
import { saveProfile } from 'core/utils/profile';
import { saveWorkspace } from 'core/utils/workspace';

const originalWindow = { ...window };
const openDocumentation = jest.fn();

beforeAll(() => {
  saveProfile({ id: '1', name: 'charlesadmin', email: 'charlesadmin@admin', workspaces: [{id: '1', name: 'test'}]});
});

beforeEach(() => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: routes.workspaces
  };

  window.open = openDocumentation;
});

afterEach(() => {
  window = originalWindow;
});

test('renders sidebar component', async () => {
  render(
    <Sidebar isExpanded={true} onClickExpand={null} />
  );

  const links = await screen.findByTestId('sidebar-links');

  const workspacesId = genMenuId(routes.workspaces);
  const accountId = genMenuId(routes.accountProfile);

  expect(screen.getByTestId(workspacesId)).toBeInTheDocument();
  expect(screen.getByTestId(accountId)).toBeInTheDocument();
  expect(links.children.length).toBe(3);
});

test('renders sidebar component with selected workspace', async () => {
  saveWorkspace({
    id: 'ws-1',
    name: 'workspace-1'
  });
  delete window.location;

  window.location = {
    ...window.location,
    pathname: routes.credentials
  };
  
  jest.spyOn(utilsAuth, 'isRoot').mockReturnValue(true);

  render(
    <Sidebar
      isExpanded={true}
      onClickExpand={jest.fn()}
    />
  );

  expect(await screen.findByText('workspace-1')).toBeInTheDocument();
});

test('renders help icon in the sidebar', async () => {
  render(
    <Sidebar isExpanded={true} onClickExpand={null} />
  );

  const helpIcon = await screen.findByTestId('icon-help');
  expect(helpIcon).toBeInTheDocument();
});

test('renders tooltip with text equal to "Documentation"', async () => {
  render(
    <Sidebar isExpanded={true} onClickExpand={null} />
  );

  const helpIcon = await screen.queryByTestId('icon-help');
  expect(helpIcon).toBeInTheDocument();

  const tooltipText = await screen.getByText('Documentation');
  expect(tooltipText).toBeInTheDocument();
});

test('opens documentation link once', async () => {
  render(
    <Sidebar isExpanded={true} onClickExpand={() => {}} />
  );

  const helpIcon = await screen.queryByTestId('icon-help');
  expect(helpIcon).toBeInTheDocument();

  act(() => userEvent.click(helpIcon));
  expect(openDocumentation).toHaveBeenCalledTimes(1);
});
