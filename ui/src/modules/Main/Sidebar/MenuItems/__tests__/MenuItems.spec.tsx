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
import { render, fireEvent, wait } from 'unit-test/testUtils';
import routes from 'core/constants/routes';
import { genMenuId } from 'core/utils/menu';
import MenuItems from '../index';

test('renders sidebar menu Items', async () => {
  const { getByTestId } = render(
    <MenuItems isExpanded expandMenu={() => jest.fn()} />
  );

  const links = getByTestId('sidebar-links');

  const workspacesId = genMenuId(routes.workspaces);
  const accountId = genMenuId(routes.account);

  expect(getByTestId(workspacesId)).toBeInTheDocument();
  expect(getByTestId(accountId)).toBeInTheDocument();
  expect(links.children.length).toBe(3);
});

test('testing outside click menu Items', async () => {
  const onOutSideCick = jest.fn();
  const props = {
    isExpanded: true
  };

  const { getByTestId } = render(
    <div onClick={onOutSideCick} data-testid="external-div">
      <MenuItems isExpanded={props.isExpanded} expandMenu={() => jest.fn()} />
    </div>
  );
  const externalDiv = getByTestId('external-div');
  const links = getByTestId('sidebar-links');

  const workspacesId = genMenuId(routes.workspaces);
  const accountId = genMenuId(routes.account);

  expect(getByTestId(workspacesId)).toBeInTheDocument();
  expect(getByTestId(accountId)).toBeInTheDocument();
  expect(links.children.length).toBe(3);
  fireEvent.click(externalDiv);
  wait(() => expect(props.isExpanded).toBeTruthy());
});

test('testing expand menu click', async () => {
  const onClickExpand = jest.fn();

  const isExpanded = false;

  const { getByTestId } = render(
    <MenuItems isExpanded={isExpanded} expandMenu={onClickExpand} />
  );
  const links = getByTestId('sidebar-links');
  const workspacesId = genMenuId(routes.workspaces);
  const accountId = genMenuId(routes.account);

  expect(getByTestId(workspacesId)).toBeInTheDocument();
  expect(getByTestId(accountId)).toBeInTheDocument();
  expect(links.children.length).toBe(3);

  fireEvent.click(links.children[1]);

  expect(onClickExpand).toHaveBeenCalled();
});