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
import { FetchMock } from 'jest-fetch-mock/types';
import { render } from 'unit-test/testUtils';
import { dark } from 'core/assets/themes/sidebar';
import { genMenuId } from 'core/utils/menu';
import Main from '../index';

jest.mock('modules/Workspaces', () => {
  return {
    __esModule: true,
    default: () => {
      return <div>Workspaces</div>;
    }
  };
});

const originalWindow = { ...window };

beforeEach(() => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: '/v2/workspaces'
  };
});

afterEach(() => {
  window = originalWindow;
});

test('render menu component', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'use fetch' }));
  const { getByTestId } = render(<Main />);

  const sidebar = getByTestId('sidebar');
  const content = getByTestId('main-content');
  const footer = getByTestId('footer');

  expect(sidebar.tagName).toBe('NAV');
  expect(content.tagName).toBe('SECTION');
  expect(footer.tagName).toBe('FOOTER');
});

test('render and collapse sidebar', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'use fetch' }));
  const menuId = genMenuId(window.location.pathname);
  const { getByTestId } = render(<Main />);

  const expandButton = getByTestId('sidebar-expand-button');

  expect(getByTestId(menuId)).toHaveTextContent(/\w+/gi);

  expandButton.click();

  expect(getByTestId(menuId).textContent).toBe('');
});

test('render menu in expanded mode with the workspaces screen active', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'use fetch' }));
  const { getByTestId } = render(<Main />);
  const icon = getByTestId('icon-workspaces');
  const iconStyle = window.getComputedStyle(icon);

  expect(iconStyle.color).toBe(dark.menuIconActive);
});
