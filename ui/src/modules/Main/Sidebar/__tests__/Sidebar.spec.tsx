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
import { render, wait } from 'unit-test/testUtils';
import routes from 'core/constants/routes';
import { genMenuId } from 'core/utils/menu';
import Sidebar from '../index';

const originalWindow = { ...window };

beforeEach(() => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: routes.workspaces
  };
});

afterEach(() => {
  window = originalWindow;
});

test('renders sidebar component', () => {
  const { getByTestId } = render(
    <Sidebar isExpanded={true} onClickExpand={null} />
  );
  const links = getByTestId('sidebar-links');

  const workspacesId = genMenuId(routes.workspaces);
  const accountId = genMenuId(routes.account);

  wait();

  expect(getByTestId(workspacesId)).toBeInTheDocument();
  expect(getByTestId(accountId)).toBeInTheDocument();
  expect(links.children.length).toBe(3);
});

test('renders sidebar component with selected workspace', () => {
  const { getByTestId, getByText } = render(
    <Sidebar isExpanded={true} onClickExpand={null} selectedWorkspace="test" />
  );

  const links = getByTestId('sidebar-links');
  const workspaceName = getByText('test');

  const workspacesId = genMenuId(routes.workspaces);
  const accountId = genMenuId(routes.account);

  expect(workspaceName).toBeInTheDocument();
  expect(getByTestId(workspacesId)).toBeInTheDocument();
  expect(getByTestId(accountId)).toBeInTheDocument();
  expect(links.children.length).toBe(3);
});
