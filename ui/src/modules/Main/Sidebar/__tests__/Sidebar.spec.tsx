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
import { FetchMock } from 'jest-fetch-mock/types';
import * as utilsAuth from 'core/utils/auth';

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

test('renders sidebar component', async () => {
  const { getByTestId } = render(
    <Sidebar isExpanded={true} onClickExpand={null} />
  );
  const links = getByTestId('sidebar-links');

  const workspacesId = genMenuId(routes.workspaces);
  const accountId = genMenuId(routes.account);

  await wait(() => expect(getByTestId(workspacesId)).toBeInTheDocument());
  expect(getByTestId(accountId)).toBeInTheDocument();
  expect(links.children.length).toBe(3);
});

test('renders sidebar componen( with selected workspace', async () => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: routes.credentials
  };

  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({
      content: [
        {
          id: 1,
          name: 'workspace',
          status: 'COMPLETE'
        }
      ]
    })
  );

  jest.spyOn(utilsAuth, 'isRoot').mockReturnValue(true);

  const { queryByTestId } = render(
    <Sidebar
      isExpanded={true}
      onClickExpand={jest.fn()}
      selectedWorkspace="test"
    />
  );

  await wait(() => expect(queryByTestId('dropdown')).toBeInTheDocument());
});
